// ./App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';  // adjust the import path if necessary
import { SafeAreaView, StatusBar } from 'react-native';
import AuthProvider from './src/contexts/AuthContext';
import { VehiclesProvider }  from './src/contexts/VehiclesContext';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <VehiclesProvider>        
        <AuthProvider>
        <AuthNavigator />
        </AuthProvider>
        </VehiclesProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
