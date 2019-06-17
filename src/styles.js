import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trackerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    winLossDialog: {
        flex: 0.25,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
    },
    buttonsContainer: {
        flex: 0.5,
        flexDirection: 'row',
    },
    trackersHeader: {
        flex: 0.2
    },
    newTrackerDialogContentView: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    }
});
