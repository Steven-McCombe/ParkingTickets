// src/AppContainer.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  // Import NavigationContainer
import AuthNavigator from './navigation/AuthNavigator';
import FlashMessage from "react-native-flash-message";
import { AuthProvider } from './contexts/AuthContext';
import { VehiclesProvider } from './contexts/VehiclesContext';

const AppContainer = () => {
  return (
    <NavigationContainer>
      <VehiclesProvider>
      <AuthProvider>  
        <AuthNavigator />
      <FlashMessage position="top" />
      </AuthProvider>
      </VehiclesProvider>
    </NavigationContainer>
  );
};

export default AppContainer;
