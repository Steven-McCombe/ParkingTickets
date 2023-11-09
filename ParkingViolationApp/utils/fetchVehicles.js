// utils/fetchVehicles.js
import { REACT_APP_SERVER_URL } from '../src/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchVehicles = async (userId, token) => {  // Accept token as a second argument
    console.log('fetchVehicles called with userId:', userId);
    try {
        const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/getVehicles?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const vehiclesData = await response.json();
        return vehiclesData;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
};
