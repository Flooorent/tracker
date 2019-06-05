import React from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars'
import Dialog, {DialogButton, DialogContent, DialogFooter, DialogTitle} from 'react-native-popup-dialog'
import styles from './src/styles'
import { TextInput } from 'react-native-gesture-handler';

const TRACKER = 'tracker'
const ALL_TRACKERS = 'allTrackers'

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
              text="CANCEL"
              bordered
              onPress={() => this.clearNewTrackerDialog()}
            />
            <DialogButton
              text="OK"
              bordered
              onPress={() => this.addNewTracker(this.state.newTracker)}
            />
          </DialogFooter>
        }
      >
        <DialogContent style={{width: 200, height: 70}}>
          <View style={styles.newTrackerDialogContentView}>
            <TextInput style={{fontSize: 20}}
              placeholder="Tracker name"
              onChangeText={(text) => this.setState({newTracker: text})}
            />
          </View>
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
    })
  }

  addNewTracker(title) {
    this.setState({
      trackers: [{title}, ...this.state.trackers],
      displayNewTrackerDialog: false,
      newTracker: '',
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
