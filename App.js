import React from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogFooter, DialogTitle} from 'react-native-popup-dialog'
import styles from './src/styles'
import { TextInput } from 'react-native-gesture-handler';

const TRACKER = 'tracker'
const ALL_TRACKERS = 'allTrackers'
const DEFAULT_TRACKER_NAME_ERROR_MESSAGE = ''

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
      currentScreen: ALL_TRACKERS,
      trackers: [
        {title: 'First Tracker'},
        {title: 'Second Tracker'},
      ],
      displayNewTrackerDialog: false,
      newTracker: '',
      newTrackerNameError: false,
      newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE,
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
  
  renderAllTrackersScreen() {
    return (
      <View style={styles.container}>
        {/* TODO: improve this header */}
        <View style={[styles.container, styles.trackersHeader]}>
          <Text>Florent</Text>
        </View>

        <Button
          title="Add new tracker"
          onPress={() => this.showNewTrackerDialog()}
        />
        
        <FlatList
          data={this.state.trackers}
          renderItem={
            ({item}) => <Button id={item.title} title={item.title} onPress={() => this.navigateToTrackerScreen()}/>
          }
          keyExtractor={(item) => item.title}
        />

        <Dialog
          visible={this.state.displayNewTrackerDialog}
          onTouchOutside={() => this.clearNewTrackerDialog()}
          footer={
            <DialogFooter>
              <DialogButton
                text='CANCEL'
                bordered
                onPress={() => this.clearNewTrackerDialog()}
              />
              <DialogButton
                text='OK'
                bordered
                onPress={() => this.addNewTracker(this.state.newTracker)}
              />
            </DialogFooter>
          }
        >
          <DialogContent style={{width: 200, height: this.state.newTrackerNameError ? 120 : 70}}>
            <View style={styles.newTrackerDialogContentView}>
              <TextInput style={{fontSize: 20}}
                placeholder='Tracker name'
                onChangeText={(text) => this.setState({
                  newTracker: text,
                  newTrackerNameError: false,
                  newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE
                })}
              />
            </View>
            {
              this.state.newTrackerNameError &&
              <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>{this.state.newTrackerNameErrorMessage}</Text>
              </View>
            }
          </DialogContent>
        </Dialog>
      </View>
    )
  }

  showNewTrackerDialog() {
    this.setState({
      displayNewTrackerDialog: true,
    })
  }

  clearNewTrackerDialog() {
    this.setState({
      displayNewTrackerDialog: false,
      newTracker: '',
      newTrackerNameError: false,
      newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE,
    })
  }

  addNewTracker(title) {
    if (title.trim() === '') {
      return this.setState({
        newTrackerNameError: true,
        newTrackerNameErrorMessage: 'Tracker name must not be empty'
      })
    }

    // TODO: we can make at maximum one pass over the array
    const indexOfTrackerWithSameTitle = this.state.trackers.map(tracker => tracker.title).indexOf(title)

    if (indexOfTrackerWithSameTitle >= 0) {
      return this.setState({
        newTrackerNameError: true,
        newTrackerNameErrorMessage: 'Tracker name already exists'
      })
    }

    this.setState({
      trackers: [{title}, ...this.state.trackers],
      displayNewTrackerDialog: false,
      newTracker: '',
      newTrackerNameError: false,
      newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE,
    })
  }

  navigateToTrackerScreen() {
    this.setState({
      currentScreen: TRACKER
    })
  }

  navigateToAllTrackersScreen() {
    this.setState({
      currentScreen: ALL_TRACKERS
    })
  }

  renderTrackerScreen() {
    const today = new Date()
    const minDate = '1998-17-12'

    return (
      <View style={styles.container}>

        <Button
          title='Back to all trackers'
          onPress={() => this.navigateToAllTrackersScreen()}
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
    )
  }

  render() {
    const currentScreen = this.state.currentScreen

    return (
      <View style={styles.container}>
        { currentScreen === TRACKER && this.renderTrackerScreen() }
        { currentScreen === ALL_TRACKERS && this.renderAllTrackersScreen() }
      </View>
    );
  }
}
