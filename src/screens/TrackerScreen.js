import React from 'react';
import {AsyncStorage, Button, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog'

import styles from '../styles'

export default class TrackerScreen extends React.Component {
    /*
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: 'Tracker',
            headerRight: (
                <Button
                    title='Delete'
                    onPress={() => navigation.navigate('Delete')}
                />
            )
        }
    }
    */
   static navigationOptions = {
       title: 'Tracker'
   }

    constructor(props) {
        super(props)

        this.state = {
            markedDates: {},
            displayDialog: false,
            dialogTitle: '',
        }
    }

    async componentDidMount() {
        const trackerName = this.props.navigation.getParam('trackerName')
        const deleteTracker = this.props.navigation.getParam('deleteTracker')

        const tempState = {
            trackerName,
            deleteTracker
        }

        try {
            const markedDates = await this.fetchMarkedDates(trackerName)

            this.setState({
                ...tempState,
                markedDates,
            })
        } catch(error) {
            // TODO: log to sentry or something
            // TODO: display some error message to the user like "we couldn't find your marked dates for some reason"
            console.log(`Error after mounting tracker ${trackerName}`, error)
            this.setState(tempState)
        }
    }

    async fetchMarkedDates(trackerName) {
        try {
            // TODO: use id instead of title
            const markedDates = await AsyncStorage.getItem(`tracker:${trackerName}`)

            if (markedDates === null) {
                return {}
            }

            return JSON.parse(markedDates)
        } catch(error) {
            // TODO: log to sentry or something
            console.log(`Error fetching marked dates for tracker ${trackerName}`, error)
        }
    }

    // TODO: add trackerName parameter instead of relying on state
    async saveMarkedDates(markedDates) {
        try {
            await AsyncStorage.setItem(`tracker:${this.state.trackerName}`, JSON.stringify(markedDates))
        } catch (error) {
            // TODO: log to sentry or something
            console.log(`Error when saving marked dates for tracker ${this.state.trackerName}`, error)
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
    
    async addWinDay(day) {
        await this.addDay(day, 'blue')
    }

    async addLossDay(day) {
        await this.addDay(day, 'red')
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

                <Button
                    title='Delete'
                    onPress={() => this.props.navigation.navigate('Delete', {
                        trackerName: this.state.trackerName
                    })}
                />

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
                <DialogContent style={styles.buttonsContainer}>
                    <DialogButton
                        text='CLEAR'
                        onPress={() => this.clearDay(this.state.dialogTitle)}
                    />
                    <DialogButton
                        text='WIN'
                        onPress={() => this.addWinDay(this.state.dialogTitle)}
                    />
                    <DialogButton
                        text='LOSS'
                        onPress={() => this.addLossDay(this.state.dialogTitle)}
                    />
                </DialogContent>
                </Dialog>
            </View>
        )
    }
}
