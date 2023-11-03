// src/styles/AuthStyles.js
import { StyleSheet } from 'react-native';

const AuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    toggleText: {
        marginTop: 10,
        textAlign: 'center',
        color: 'blue',
    },
});

export default AuthStyles;
