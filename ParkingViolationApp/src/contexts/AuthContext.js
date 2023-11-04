// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';  // Import useEffect here
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const value = {
        user,
        setUser,
        token, 
        setToken,
    };

    const loadUserData = async () => {
        // replace the following line with your logic to get user data
        const storedUser = await AsyncStorage.getItem('user'); 
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("stored user" + storedUser)
        }
    };
    
    useEffect(() => {
        loadUserData();
    }, []);
    
    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
            setToken(storedToken);
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
