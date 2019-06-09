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
        const deleteTracker = this.props.navigation.getParam('deleteTracker')

        this.setState({
            trackerName,
            deleteTracker,
        })
    }

    async removeTrackerData(trackerName) {
        await AsyncStorage.removeItem(`tracker:${trackerName}`)
    }

    async deleteTracker() {
        this.removeTrackerData(this.state.trackerName)
        removeTrackerFromAllTrackers(this.state.trackerName)
        this.state.deleteTracker()
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
