// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VehiclesContext } from './VehiclesContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { resetVehicles } = useContext(VehiclesContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [storedUser, storedToken] = await Promise.all([
                    AsyncStorage.getItem('user'),
                    AsyncStorage.getItem('userToken')
                ]);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Failed to load initial data:', error);
            } finally {
                setLoading(false);  // Ensure loading is set to false in all cases
            }
        };
        if (isLoggedIn) {
            loadInitialData();
        }
    }, [isLoggedIn]); 
    

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('user');
            resetVehicles();  // This should clear the vehicles state
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

      const value = {
        user,
        setUser,
        token,
        setToken,
        loading,
        logout, 
        setIsLoggedIn,

      };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
