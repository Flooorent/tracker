import React from 'react';
import {Button, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog'

import styles from '../styles'

export default class TrackerScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            markedDates: {},
            displayDialog: false,
            dialogTitle: '',
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
    
    addWinDay(day) {
        this.addDay(day, 'blue')
    }

    addLossDay(day) {
        this.addDay(day, 'red')
    }

    addDay(day, selectedColor) {
        const markedDates = {...this.state.markedDates}

        markedDates[day] = {
            selected: true,
            selectedColor
        }

        this.setState({markedDates}, this.clearDialog)
    }

    render() {
        const today = new Date()
        const minDate = '1998-17-12'

        return (
            <View style={styles.container}>

                <Text>{this.props.navigation.getParam('trackerName')}</Text>

                <Button
                    title='Delete'
                    onPress={() => {
                        this.props.navigation.getParam('deleteTracker')()
                        this.props.navigation.navigate('AllTrackers')
                    }}
                />

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
                        text='Win'
                        onPress={() => this.addWinDay(this.state.dialogTitle)}
                    />
                    <DialogButton
                        text='Loss'
                        onPress={() => this.addLossDay(this.state.dialogTitle)}
                    />
                </DialogContent>
                </Dialog>
            </View>
        )
    }
}
