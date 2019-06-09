import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation'
import {AllTrackersScreen, DeleteScreen, TrackerScreen} from './src/screens'

const TrackerSwitch = createSwitchNavigator({
  Tracker: TrackerScreen,
  Delete: DeleteScreen,
})

const AppNavigator = createStackNavigator({
  AllTrackers: AllTrackersScreen,
  TrackerSwitch: TrackerSwitch,
})

export default createAppContainer(AppNavigator)
