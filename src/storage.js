import {AsyncStorage} from 'react-native'

const ALL_TRACKERS_KEY = 'allTrackers'

async function removeTrackerFromAllTrackers(trackerName) {
    try {
        const allTrackers = await fetchAllTrackers()
        const indexOfTrackerToDelete = allTrackers.map(tracker => tracker.title).indexOf(trackerName)

        if(indexOfTrackerToDelete >= 0) {
            const newAllTrackers = [allTrackers.slice(0, indexOfTrackerToDelete), ...allTrackers.slice(indexOfTrackerToDelete + 1)]
            await saveAllTrackers(newAllTrackers)
        }
    } catch(e) {
        // TODO: log to sentry or something
        console.error(`Couldn't remove tracker ${trackerName} from all trackers:`, e)
    }
}

async function fetchAllTrackers() {
    try {
        const allTrackers = await AsyncStorage.getItem(ALL_TRACKERS_KEY)

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

async function saveAllTrackers(allTrackers) {
    await AsyncStorage.setItem(ALL_TRACKERS_KEY, JSON.stringify(allTrackers))
}

export {
    fetchAllTrackers,
    removeTrackerFromAllTrackers,
    saveAllTrackers,
}
