import React from 'react';
import {AsyncStorage, Button, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog'
import { TextInput } from 'react-native-gesture-handler';

import styles from '../styles'
import { renameTracker } from '../storage'

const CLEAR = 'CLEAR'
const WIN = 'WIN'
const LOSS = 'LOSS'
const VALID_STATUS = [CLEAR, WIN, LOSS]

const WIN_COLOR = 'blue'
const LOSS_COLOR = 'red'

function getThisMonth() {
    const localeDate = new Date()
    const utcDate = new Date(localeDate.getTime() - localeDate.getTimezoneOffset() * 60000 )
    const stringDate = utcDate.toISOString().split('T')[0]
    return stringDate.split('-', 2).join('-')
}

export default class TrackerScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerRight: (
                <Button
                    title='Delete'
                    onPress={() => navigation.navigate('Delete', {
                        trackerName: navigation.getParam('trackerName'),
                        trackerId: navigation.getParam('trackerId'),
                        removeTrackerFromState: navigation.getParam('removeTrackerFromState'),
                    })}
                />
            )
        }
    }
    constructor(props) {
        super(props)

        this.state = {
            markedDates: {},
            displayDialog: false,
            dialogTitle: '',
            newName: '',
            displayedMonth: getThisMonth(),
            monthWinRate: 0,
        }

        this.updateDay = this.updateDay.bind(this)
    }

    async componentDidMount() {
        const trackerName = this.props.navigation.getParam('trackerName')
        const trackerId = this.props.navigation.getParam('trackerId')
        const renameTrackerInParentState = this.props.navigation.getParam('renameTrackerInState')

        const tempState = {
            trackerName,
            trackerId,
            newName: trackerName,
            renameTrackerInParentState,
        }

        try {
            const markedDates = await this.fetchMarkedDates(trackerId)
            const monthWinRate = this.getWinRate(markedDates, this.state.displayedMonth)

            this.setState({
                ...tempState,
                markedDates,
                monthWinRate,
            })
        } catch(error) {
            // TODO: log to sentry or something
            // TODO: display some error message to the user like "we couldn't find your marked dates for some reason"
            console.log(`Error after mounting tracker ${trackerId}`, error)
            this.setState(tempState)
        }
    }

    /**
     * Get displayed month's winrate.
     * 
     * @param {Object} markedDates all marked dates, of the form { day1: 'WIN', day2: 'LOSS' }
     * @param {String} month current displayed month with format 'YYYY-mm'
     */
    getWinRate(markedDates, month) {
        const winsAndLosses = {
            [WIN]: 0,
            [LOSS]: 0,
        }

        for (day in markedDates) {
            if (day.startsWith(month)) {
                winsAndLosses[markedDates[day]] += 1
            }
        }

        if (winsAndLosses[WIN] === 0) {
            return 0
        }

        if (winsAndLosses[LOSS] === 0) {
            return 100
        }

        return Math.floor(winsAndLosses[WIN] / (winsAndLosses[WIN] + winsAndLosses[LOSS]) * 100)
    }

    async fetchMarkedDates(trackerId) {
        try {
            // TODO: use id instead of title
            const markedDates = await AsyncStorage.getItem(`tracker:${trackerId}`)

            if (markedDates === null) {
                return {}
            }

            return JSON.parse(markedDates)
        } catch(error) {
            // TODO: log to sentry or something
            console.log(`Error fetching marked dates for tracker ${trackerId}`, error)
        }
    }

    // TODO: add trackerName parameter instead of relying on state
    async saveMarkedDates(markedDates) {
        try {
            await AsyncStorage.setItem(`tracker:${this.state.trackerId}`, JSON.stringify(markedDates))
        } catch (error) {
            // TODO: log to sentry or something
            console.log(`Error when saving marked dates for tracker ${this.state.trackerId}`, error)
        }
    }

    showDialog(day) {
        this.setState({
          displayDialog: true,
          dialogTitle: day.dateString,
        })
    }
    
    clearDialog() {
        this.setState({
            displayDialog: false,
            dialogTitle: ''
        })
    }

    async updateDay(day, status) {
        if (VALID_STATUS.includes(status)) {
            if (status === CLEAR) {
                return await this.clearDay(day)
            }

            return await this.addDay(day, status)
        }

        // TODO: log to sentry or something
        console.warn(`Status ${status} is not a valid status.`)
    }

    async addDay(day, status) {
        const markedDates = {...this.state.markedDates}

        markedDates[day] = status

        try {
            this.saveMarkedDates(markedDates)
        } catch (error) {
            // TODO: log to sentry or something
            // TODO: display something to user
            console.log(`Error when adding day for tracker ${this.state.trackerName}`, error)
            return
        }

        const monthWinRate = this.getWinRate(markedDates, this.state.displayedMonth)

        this.setState({
            markedDates,
            monthWinRate,
        }, this.clearDialog)
    }

    async clearDay(day) {
        const markedDates = {...this.state.markedDates}

        if (markedDates[day]) {
            delete markedDates[day]

            try {
                await this.saveMarkedDates(markedDates)
            } catch (error) {
                // TODO: log to sentry or something
                // TODO: display something to user
                console.log(`Error when adding day for tracker ${this.state.trackerName}`, error)
                return
            }

            const monthWinRate = this.getWinRate(markedDates, this.state.displayedMonth)

            this.setState({
                markedDates,
                monthWinRate,
            }, this.clearDialog)
        }

        this.clearDialog()
    }

    async updateTrackerName() {
        console.log('updating tracker name')
        const cleanedNewName = this.state.newName.trim()

        if (cleanedNewName === '') {
            return this.setState({
                newName: this.state.trackerName,
            })
        }

        await renameTracker(this.state.trackerId, cleanedNewName)
        
        this.setState({
            trackerName: cleanedNewName,
            newName: cleanedNewName,
        }, () => this.state.renameTrackerInParentState(cleanedNewName))
    }

    updateDisplayedMonth(day) {
        const newMonth = `${day.year}-${day.month.toString().padStart(2, '0')}`
        const monthWinRate = this.getWinRate(this.state.markedDates, newMonth)

        this.setState({
            displayedMonth: newMonth,
            monthWinRate,
        })
    }

    render() {
        const today = new Date()
        const minDate = '1998-17-12'

        // TODO: is it better to have the styles dates in the state ?
        const styledMarkedDates = {}
        for (let day in this.state.markedDates) {
            const backgroundColor = this.state.markedDates[day] === WIN ? WIN_COLOR : LOSS_COLOR

            styledMarkedDates[day] = {
                customStyles: {
                    container: {
                        backgroundColor,
                        borderRadius: 0,
                    },
                    text: {
                        color: 'white',
                    },
                }
            }
        }

        return (
            <View style={styles.trackerContainer}>

                <TextInput
                    style={{ fontSize: 30 }}
                    value={this.state.newName}
                    onChangeText={(text) => this.setState({newName: text})}
                    onEndEditing={() => this.updateTrackerName()}
                />

                <Text>{`${this.state.monthWinRate}% Win Rate`}</Text>

                <Calendar
                    maxDate={today}
                    minDate={minDate}
                    onDayPress={(day) => this.showDialog(day)}
                    hideExtraDays={false}
                    markingType={'custom'}
                    markedDates={styledMarkedDates}
                    onMonthChange={(day) => this.updateDisplayedMonth(day) }
                />

                <Dialog
                    visible={this.state.displayDialog}
                    onTouchOutside={() => this.clearDialog()}
                    dialogTitle={<DialogTitle title={this.state.dialogTitle}/>}
                    dialogStyle={styles.winLossDialog}
                >
                <StatusDialogContent
                    markedDates={this.state.markedDates}
                    day={this.state.dialogTitle}
                    updateDay={(status) => this.updateDay(this.state.dialogTitle, status)} />
                </Dialog>
            </View>
        )
    }
}


function StatusDialogContent(props) {
    if (props.markedDates[props.day]) {
        const isCurrentStatusWin = props.markedDates[props.day].selectedColor === WIN_COLOR

        if (isCurrentStatusWin) {
            return (
                <DialogContent style={styles.buttonsContainer}>
                    <DialogButton
                        text={CLEAR}
                        onPress={() => props.updateDay(CLEAR)}
                    />
                    <DialogButton
                        text={LOSS}
                        onPress={() => props.updateDay(LOSS)}
                    />
                </DialogContent>
            )
        }

        return (
            <DialogContent style={styles.buttonsContainer}>
                <DialogButton
                    text={CLEAR}
                    onPress={() => props.updateDay(CLEAR)}
                />
                <DialogButton
                    text={WIN}
                    onPress={() => props.updateDay(WIN)}
                />
            </DialogContent>
        )
    }

    return (
        <DialogContent style={styles.buttonsContainer}>
            <DialogButton
                text={WIN}
                onPress={() => props.updateDay(WIN)}
            />
            <DialogButton
                text={LOSS}
                onPress={() => props.updateDay(LOSS)}
            />
        </DialogContent>
    )
}
