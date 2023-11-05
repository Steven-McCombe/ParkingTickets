// src/contexts/VehiclesContext.js
import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);

  const addNewVehicleToState = (newVehicle) => {
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
  };

  const value = {
    vehicles,
    addNewVehicleToState, 
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
