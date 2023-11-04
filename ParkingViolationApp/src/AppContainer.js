// src/AppContainer.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  // Import NavigationContainer
import AuthNavigator from './navigation/AuthNavigator';
import FlashMessage from "react-native-flash-message";
import { AuthProvider } from './contexts/AuthContext';

const AppContainer = () => {
  return (
    <NavigationContainer>
      <AuthProvider>  
        <AuthNavigator />
      <FlashMessage position="top" />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppContainer;
