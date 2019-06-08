import {createAppContainer, createStackNavigator} from 'react-navigation'
import {AllTrackersScreen, TrackerScreen} from './src/screens'

const AppNavigator = createStackNavigator(
  {
    AllTrackers: AllTrackersScreen,
    Tracker: TrackerScreen,
  }
)

export default createAppContainer(AppNavigator)
