// src/screens/MainScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import ViolationsComponent from '../components/ViolationsComponent';

const MainScreen = ({ navigation, route }) => {
  const { vehicleId } = route.params; // Retrieve the vehicleId parameter

  return (
    <View style={{ flex: 1 }}>
      <ViolationsComponent vehicleId={vehicleId} />
    </View>
  );
};

export default MainScreen;
