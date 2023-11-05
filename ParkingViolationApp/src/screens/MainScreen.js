// src/screens/MainScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const MainScreen = ({navigation}) => {
  return (
    <View>
      <Text>Main Screen</Text>
      <Button title="Profile" onPress={() => navigation.navigate('ProfileScreen')} />
    </View>
  );
};

export default MainScreen;
