import { StyleSheet } from 'react-native';

const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    regularText: {
        fontSize: 16,
        marginBottom: 10,
    },
    cardContainer: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconButton: {
        padding: 10,
    },
    icon: {
        fontSize: 24,
    },

});

export default ProfileStyles;
