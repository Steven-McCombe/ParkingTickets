// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';
import MainScreen from '../screens/MainScreen';  // Import MainScreen
import FlashMessage from "react-native-flash-message";
const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MainScreen"  // Define MainScreen in your navigator
        component={MainScreen}
      />
    </Stack.Navigator>
    
  );
};

export default AuthNavigator;
