// src/contexts/VehiclesContext.js
import React, { createContext, useState } from 'react';

export const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);

    return (
        <VehiclesContext.Provider value={{ vehicles, setVehicles }}>
            {children}
        </VehiclesContext.Provider>
    );
};
