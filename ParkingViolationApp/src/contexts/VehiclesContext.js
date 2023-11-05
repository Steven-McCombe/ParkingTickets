// src/contexts/VehiclesContext.js
import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_SERVER_URL } from '../config';
export const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);

  const addNewVehicleToState = async (newVehicle) => {
    try {
        const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/addVehicle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: user._id, ...newVehicle }),
        });
        const data = await response.json();
        setVehicles(prevVehicles => [...prevVehicles, data]);
    } catch (error) {
        console.error('Failed to add new vehicle:', error);
    }
};
    const resetVehicles = async () => {
        try {
            await AsyncStorage.removeItem('vehicles');  // Ensure vehicles are cleared from AsyncStorage
            setVehicles([]);
        } catch (error) {
            console.error('Error resetting vehicles:', error);
        }
    };

    return (
        <VehiclesContext.Provider value={{ vehicles,setVehicles, resetVehicles, addNewVehicleToState  }}>
            {children}
        </VehiclesContext.Provider>
    );
};
