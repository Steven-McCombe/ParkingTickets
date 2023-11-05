// ./src/screens/AddVehicleScreen.js
import React, { useState , useContext} from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AddVehicleStyles from '../styles/AddVehicleStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stateOptions, plateTypeOptions } from '../data/data';
import { REACT_APP_SERVER_URL } from '../config';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { VehiclesContext } from '../contexts/VehiclesContext';  

const AddVehicleScreen = ({ navigation }) => {
  const [nickName, setNickName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [state, setState] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const { vehicles, setVehicles } = useContext(VehiclesContext);
  const { addNewVehicleToState } = useContext(VehiclesContext);

  const fetchUpdatedVehicles = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userId = JSON.parse(await AsyncStorage.getItem('user'))._id;
  
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/getVehicles?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return;
      }
  
      const updatedVehicles = await response.json();
      setVehicles(updatedVehicles);  // Update the vehicles state in VehiclesContext
  
    } catch (error) {
   console.log('Error fetching vehicles:', error);
    }
  };
  

  const validateInput = (value, options) => {
    return options.some(option => option.value === value);
  };

  const addVehicle = async () => {
    if (!validateInput(state, stateOptions) || !validateInput(licenseType, plateTypeOptions)) {
      showMessage({
        message: "Invalid input",
        description: "Please enter valid state and license type values.",
        type: "danger",
      });
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    const userId = JSON.parse(await AsyncStorage.getItem('user'))._id;

    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/addVehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, nickName, licensePlate, licenseType, state }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        showMessage({
          message: "Error",
          description: errorText,
          type: "danger",
        });
        return;
      }

      const data = await response.json();
      addNewVehicleToState(data); 
      showMessage({
          message: "Success",
          description: "Vehicle added successfully!",
          type: "success",
      });
      console.log("vehicle added")
      await fetchUpdatedVehicles();
      navigation.goBack();
  } catch (error) {
      showMessage({
        message: "Error",
        description: error.toString(),
        type: "danger",
      });
    }
  };


  return (
    <ScrollView style={AddVehicleStyles.container}>
      <TextInput
        style={AddVehicleStyles.input}
        placeholder='Nickname (e.g., Johns Van)'
        value={nickName}
        onChangeText={setNickName}
      />
      <TextInput
        style={AddVehicleStyles.input}
        placeholder='Plate (e.g., ABC1234))'
        value={licensePlate}
        onChangeText={setLicensePlate}
      />
     <TextInput
        style={AddVehicleStyles.input}
        placeholder='State on Plate (e.g., NY)'
        value={state}
        onChangeText={setState}
      />
      <TextInput
        style={AddVehicleStyles.input}
        placeholder='License Type (e.g., PAS)'
        value={licenseType}
        onChangeText={setLicenseType}
      />
      <TouchableOpacity onPress={addVehicle} style={AddVehicleStyles.button}>
        <Text style={AddVehicleStyles.buttonText}>Add Vehicle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddVehicleScreen;