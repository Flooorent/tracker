import React from 'react'
import {AsyncStorage, Button, FlatList, Text, View} from 'react-native'
import {TextInput} from 'react-native-gesture-handler'
import Dialog, {DialogButton, DialogContent, DialogFooter} from 'react-native-popup-dialog'
import styles from '../styles'

const DEFAULT_NEW_TRACKER_NAME = ''
const DEFAULT_TRACKER_NAME_ERROR_MESSAGE = ''

export default class AllTrackersScreen extends React.Component {
    static navigationOptions = {
        title: 'All Trackers'
    }

    constructor(props) {
        super(props)

        this.state = {
            trackers: [],
            displayNewTrackerDialog: false,
            newTracker: DEFAULT_NEW_TRACKER_NAME,
            newTrackerNameError: false,
            newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE,
        }
    }

    async componentDidMount() {
        const allTrackers = await this.fetchAllTrackers()

        this.setState({
            trackers: allTrackers,
        })
    }

    async fetchAllTrackers() {
        try {
            const allTrackers = await AsyncStorage.getItem('allTrackers')

            if (allTrackers === null) {
                return []
            }
    
            return JSON.parse(allTrackers)
        } catch(e) {
            // TODO: log to sentry or something
            // TODO: display error message to user
            console.error("Couldn't fetch all trackers")
            return []
        }
    }

    showNewTrackerDialog() {
        this.setState({
            displayNewTrackerDialog: true,
        })
    }

    clearNewTrackerDialog({resetNewTrackerName = true} = {}) {
        this.setState({
            displayNewTrackerDialog: false,
            newTracker: resetNewTrackerName ? DEFAULT_NEW_TRACKER_NAME : this.state.newTracker,
            newTrackerNameError: false,
            newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE,
        })
    }

    async addNewTracker(title) {
        const cleanedTitle = title.trim()
    
        if (cleanedTitle === '') {
            return this.setState({
                newTrackerNameError: true,
                newTrackerNameErrorMessage: 'Tracker name must not be empty'
            })
        }
    
        // TODO: we can make at maximum one pass over the array
        const indexOfTrackerWithSameTitle = this.state.trackers.map(tracker => tracker.title).indexOf(cleanedTitle)
    
        if (indexOfTrackerWithSameTitle >= 0) {
            return this.setState({
                newTrackerNameError: true,
                newTrackerNameErrorMessage: 'Tracker name already exists'
            })
        }

        const newAllTrackers = [{title: cleanedTitle}, ...this.state.trackers]

        try {
            await this.saveAllTrackers(newAllTrackers)
        } catch(e) {
            // TODO: log to sentry or something
            // TODO: display error message to user
            console.log("Couldn't save all trackers")
            return
        }
        
        this.setState({
            trackers: newAllTrackers,
            displayNewTrackerDialog: false,
            newTracker: DEFAULT_NEW_TRACKER_NAME,
            newTrackerNameError: false,
            newTrackerNameErrorMessage: DEFAULT_TRACKER_NAME_ERROR_MESSAGE,
        })
    }

    async saveAllTrackers(allTrackers) {
        await AsyncStorage.setItem('allTrackers', JSON.stringify(allTrackers))
    }

    deleteTracker(trackerName) {
        const indexOfTrackerToDelete = this.state.trackers.map(tracker => tracker.title).indexOf(trackerName)
    
        if (indexOfTrackerToDelete >= 0) {
            // TODO: faire une deep copy ? Ou utiliser un objet à la place d'un array pour this.state.trackers
            const newTrackers = [...this.state.trackers.slice(0, indexOfTrackerToDelete), ...this.state.trackers.slice(indexOfTrackerToDelete + 1)]
        
            return this.setState({
                trackers: newTrackers,
            })
        }
    }

    render() {
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
                
                {
                    this.state.trackers.length > 0 ?
                    <FlatList
                        data={this.state.trackers}
                        renderItem={
                            ({item}) => (
                                <Button
                                    id={item.title}
                                    title={item.title}
                                    onPress={() => this.props.navigation.navigate('Tracker', {
                                        trackerName: item.title,
                                        deleteTracker: () => this.deleteTracker(item.title)
                                    })}
                                />
                            )
                        }
                        keyExtractor={(item) => item.title}
                    /> :
                    <Text>You don't have any tracker yet</Text>
                }
        
                <Dialog
                    visible={this.state.displayNewTrackerDialog}
                    onTouchOutside={() => this.clearNewTrackerDialog({resetNewTrackerName: false})}
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
                            autoFocus={true}
                            value={this.state.newTracker}
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
}
