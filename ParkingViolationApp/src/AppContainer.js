// src/AppContainer.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  // Import NavigationContainer
import AuthNavigator from './navigation/AuthNavigator';
import FlashMessage from "react-native-flash-message";

const AppContainer = () => {
  return (
    <NavigationContainer>
      <AuthNavigator />
      <FlashMessage position="top" />
    </NavigationContainer>
  );
};

export default AppContainer;
