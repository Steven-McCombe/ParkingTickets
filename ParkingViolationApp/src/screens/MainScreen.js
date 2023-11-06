// src/screens/MainScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import ViolationsComponent from '../components/ViolationsComponent';

const MainScreen = ({ navigation, route }) => {
  const { vehicleId } = route.params; // Retrieve the vehicleId parameter

  // You can then pass this vehicleId to your ViolationsComponent
  // or use it in a fetch call to get the violations for this vehicle.

  return (
    <View style={{ flex: 1 }}>
      <ViolationsComponent vehicleId={vehicleId} />
    </View>
  );
};

export default MainScreen;
