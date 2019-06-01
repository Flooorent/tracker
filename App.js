import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markedDates: {
        '2019-06-01': {selected: true, selectedColor: 'blue'},
        '2019-06-02': {selected: true, selectedColor: 'blue'},
        '2019-06-03': {selected: true, selectedColor: 'blue'},
        '2019-06-04': {selected: true, selectedColor: 'red'},
        '2019-06-05': {selected: true, selectedColor: 'blue'},
      },
      displayDialog: true,
      dialogTitle: '',
    }
  }

  showDialog(day) {
    this.setState({
      displayDialog: true,
      dialogTitle: day.day,
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
        >
          {/* TODO: use flexDirection: row; for buttons */}
          <DialogContent>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
