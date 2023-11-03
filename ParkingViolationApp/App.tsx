// Import necessary modules and components
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';  // adjust the import path if necessary
import { SafeAreaView, StatusBar } from 'react-native';



const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <AuthNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
