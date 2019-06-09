import React from 'react'
import {AsyncStorage, Button, Text, View} from 'react-native'

import {removeTrackerFromAllTrackers} from '../storage'

export default class DeleteScreen extends React.Component {
    static navigationOptions = {
        title: 'Delete'
    }

    constructor(props) {
        super(props)

        this.state = {
            trackerName: ''
        }
    }

    componentDidMount() {
        const trackerName = this.props.navigation.getParam('trackerName')

        this.setState({
            trackerName,
        })
    }

    async removeTrackerData(trackerName) {
        await AsyncStorage.removeItem(`tracker:${trackerName}`)
    }

    delete() {
        // TODO: make it an async function, try catch that, display error message to user
        this.removeTrackerData(this.state.trackerName)
        removeTrackerFromAllTrackers(this.state.trackerName)
        // we have to clean all trackers state since we use a stack navigator (component AllTrackersScreen won't be unmounted) 
        this.state.deleteTracker()
        this.props.navigation.navigate('AllTrackers')
    }

    render() {
        return (
            <View>
                <Text>{`Are you sure you want to delete ${this.state.trackerName} ?`}</Text>
                <Button
                    title='DELETE'
                    onPress={() => this.delete()}
                />
            </View>
        )
    }
}
