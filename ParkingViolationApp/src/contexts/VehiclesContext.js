// src/contexts/VehiclesContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const loadInitialVehicles = async () => {
            try {
                const storedVehicles = await AsyncStorage.getItem('vehicles');
                if (storedVehicles) {
                    setVehicles(JSON.parse(storedVehicles));
                }
            } catch (error) {
                console.error('Failed to load initial vehicles:', error);
            }
        };
        loadInitialVehicles();
    }, []);

    const updateVehicles = async (newVehicles) => {
        try {
            await AsyncStorage.setItem('vehicles', JSON.stringify(newVehicles));
            setVehicles(newVehicles);
        } catch (error) {
            console.error('Failed to update vehicles:', error);
        }
    };

    return (
        <VehiclesContext.Provider value={{ vehicles, setVehicles: updateVehicles }}>
            {children}
        </VehiclesContext.Provider>
    );
};
