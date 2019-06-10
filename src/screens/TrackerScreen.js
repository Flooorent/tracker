import React from 'react';
import {AsyncStorage, Button, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog'

import styles from '../styles'

const CLEAR = 'CLEAR'
const WIN = 'WIN'
const LOSS = 'LOSS'

const WIN_COLOR = 'blue'
const LOSS_COLOR = 'red'

export default class TrackerScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Tracker',
            headerRight: (
                <Button
                    title='Delete'
                    onPress={() => navigation.navigate('Delete', {
                        trackerName: navigation.getParam('trackerName'),
                        trackerid: navigation.getParam('trackerId'),
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
        }

        this.updateDay = this.updateDay.bind(this)
    }

    async componentDidMount() {
        const trackerName = this.props.navigation.getParam('trackerName')
        const trackerId = this.props.navigation.getParam('trackerId')

        const tempState = {
            trackerName,
            trackerId,
        }

        try {
            const markedDates = await this.fetchMarkedDates(trackerId)

            this.setState({
                ...tempState,
                markedDates,
            })
        } catch(error) {
            // TODO: log to sentry or something
            // TODO: display some error message to the user like "we couldn't find your marked dates for some reason"
            console.log(`Error after mounting tracker ${trackerId}`, error)
            this.setState(tempState)
        }
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
        if (status === WIN) {
            return await this.addDay(day, WIN_COLOR)
        }

        if (status === LOSS) {
            return this.addDay(day, LOSS_COLOR)
        }

        await this.clearDay(day)
    }

    async addDay(day, selectedColor) {
        const markedDates = {...this.state.markedDates}

        markedDates[day] = {
            selected: true,
            selectedColor
        }

        try {
            this.saveMarkedDates(markedDates)
        } catch (error) {
            // TODO: log to sentry or something
            // TODO: display something to user
            console.log(`Error when adding day for tracker ${this.state.trackerName}`, error)
            return
        }

        this.setState({markedDates}, this.clearDialog)
    }

    async clearDay(day) {
        const markedDates = {...this.state.markedDates}

        if (markedDates[day]) {
            delete markedDates[day]

            try {
                this.saveMarkedDates(markedDates)
            } catch (error) {
                // TODO: log to sentry or something
                // TODO: display something to user
                console.log(`Error when adding day for tracker ${this.state.trackerName}`, error)
                return
            }

            this.setState({markedDates}, this.clearDialog)
        }

        this.clearDialog()
    }

    render() {
        const today = new Date()
        const minDate = '1998-17-12'

        return (
            <View style={styles.container}>

                <Text>{this.state.trackerName}</Text>

                <Calendar
                    maxDate={today}
                    minDate={minDate}
                    onDayPress={(day) => this.showDialog(day)}
                    hideExtraDays={false}
                    markedDates={this.state.markedDates}
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
