// Import necessary modules and components
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';  // adjust the import path if necessary
import { SafeAreaView, StatusBar } from 'react-native';
import AuthProvider from './src/contexts/AuthContext';


const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
        <AuthNavigator />
        </AuthProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
