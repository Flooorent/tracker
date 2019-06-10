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
            trackerName: '',
        }
    }

    componentDidMount() {
        const trackerName = this.props.navigation.getParam('trackerName')
        const trackerId = this.props.navigation.getParam('trackerId')
        const removeTrackerFromState = this.props.navigation.getParam('removeTrackerFromState')

        this.setState({
            trackerName,
            trackerId,
            removeTrackerFromState,
        })
    }

    async removeTrackerData(trackerId) {
        await AsyncStorage.removeItem(`tracker:${trackerId}`)
    }

    async deleteTracker() {
        this.removeTrackerData(this.state.trackerId)
        removeTrackerFromAllTrackers(this.state.trackerName)
        this.state.removeTrackerFromState()
        this.props.navigation.navigate('AllTrackers')
    }

    render() {
        return (
            <View>
                <Text>{`Are you sure you want to delete ${this.state.trackerName} ?`}</Text>

                <Button
                    title='Delete'
                    onPress={() => this.deleteTracker()}
                />
            </View>
        )
    }
}
