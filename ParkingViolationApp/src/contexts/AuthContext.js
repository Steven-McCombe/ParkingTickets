// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


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
                setLoading(false); 
            }
        };
        loadInitialData();
    }, []);

    const logout = async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('user');
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
        logout,  // provide logout function via context
      };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
