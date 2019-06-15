import {AsyncStorage} from 'react-native'

const ALL_TRACKERS_KEY = 'allTrackers'

function findTrackerIndex(trackers, trackerId) {
    return trackers.map(tracker => tracker.id).indexOf(trackerId)
}

async function removeTrackerFromAllTrackers(trackerId) {
    try {
        const allTrackers = await fetchAllTrackers()
        const indexOfTrackerToDelete = findTrackerIndex(allTrackers, trackerId)

        if(indexOfTrackerToDelete >= 0) {
            const newAllTrackers = [...allTrackers.slice(0, indexOfTrackerToDelete), ...allTrackers.slice(indexOfTrackerToDelete + 1)]
            await saveAllTrackers(newAllTrackers)
        }
    } catch(e) {
        // TODO: log to sentry or something
        console.error(`Couldn't remove tracker ${trackerId} from all trackers:`, e)
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

async function renameTracker(trackerId, newTrackerName) {
    const trackers = await fetchAllTrackers()
    const trackerIndex = findTrackerIndex(trackers, trackerId)

    if (trackerIndex >= 0) {
        const tracker = trackers[trackerIndex]

        if (tracker.title !== newTrackerName) {
            tracker.title = newTrackerName
            await saveAllTrackers(trackers)
        }
    }

}

export {
    fetchAllTrackers,
    removeTrackerFromAllTrackers,
    renameTracker,
    saveAllTrackers,
}
