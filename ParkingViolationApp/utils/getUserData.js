import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
    try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson !== null) {
            return JSON.parse(userJson);
        } else {
            console.log('No user data found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
};