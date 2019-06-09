import {createAppContainer, createStackNavigator} from 'react-navigation'
import {AllTrackersScreen, DeleteScreen, TrackerScreen} from './src/screens'

const AppNavigator = createStackNavigator(
  {
    AllTrackers: AllTrackersScreen,
    Tracker: TrackerScreen,
    Delete: DeleteScreen
  }
)

export default createAppContainer(AppNavigator)
