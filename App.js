import React from 'react';
import {View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog'
import styles from './src/styles'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markedDates: {
        '2019-05-29': {selected: true, selectedColor: 'blue'},
        '2019-05-30': {selected: true, selectedColor: 'blue'},
        '2019-05-31': {selected: true, selectedColor: 'blue'},
        '2019-06-01': {selected: true, selectedColor: 'red'},
      },
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

  render() {
    const today = new Date()
    const minDate = '1998-17-12'

    return (
      <View style={styles.container}>

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
          dialogStyle={styles.dialog}
        >
          {/* TODO: use flexDirection: row; for buttons */}
          <DialogContent style={styles.buttonsContainer}>
            <DialogButton
              text="Win"
              onPress={() => console.log('Pressed WIN')}
            />
            <DialogButton
              text="Loss"
              onPress={() => console.log('Pressed LOSS')}
            />
          </DialogContent>
        </Dialog>

      </View>
    );
  }
}
