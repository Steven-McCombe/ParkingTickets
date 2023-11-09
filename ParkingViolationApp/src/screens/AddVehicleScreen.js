// ./src/screens/AddVehicleScreen.js.
import React, { useState , useContext} from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AddVehicleStyles from '../styles/AddVehicleStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stateOptions, plateTypeOptions } from '../data/data';
import { REACT_APP_SERVER_URL } from '../config';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { VehiclesContext } from '../contexts/VehiclesContext';  
import axios from 'axios';

const AddVehicleScreen = ({ navigation }) => {
  const [nickName, setNickName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [state, setState] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const { vehicles, setVehicles, addNewVehicleToState } = useContext(VehiclesContext);


  const fetchUpdatedVehicles = async () => {
    console.log('fetchUpdatedVehicles called');
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
  console.log('addVehicle called with', { nickName, licensePlate, licenseType, state });

  if (!validateInput(state, stateOptions) || !validateInput(licenseType, plateTypeOptions)) {
    showMessage({
      message: "Invalid input",
      description: "Please enter valid state and license type values.",
      type: "danger",
    });
    return; // Ensure you return early here to exit the function if the input is invalid
  }

  const userId = JSON.parse(await AsyncStorage.getItem('user'))._id;
  const token = await AsyncStorage.getItem('userToken'); // Get the token from AsyncStorage

  try {
    // First, add the vehicle
    const vehicleResponse = await fetch(`${REACT_APP_SERVER_URL}/vehicles/addVehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      },
      body: JSON.stringify({ user: userId, nickName, licensePlate, licenseType, state }),
    });

    if (!vehicleResponse.ok) {
      const errorText = await vehicleResponse.text();
      showMessage({
        message: "Error",
        description: errorText,
        type: "danger",
      });
      return;
    }

    const vehicleData = await vehicleResponse.json();
    addNewVehicleToState(vehicleData); // ... show success message
    console.log(vehicleData, "vehicleData");

    // Now, fetch the violation data for the added vehicle using fetch instead of axios
    const violationsResponse = await fetch(`https://data.cityofnewyork.us/resource/nc67-uf89.json?plate=${licensePlate}`);
    const violationsData = await violationsResponse.json();
    console.log(`https://data.cityofnewyork.us/resource/nc67-uf89.json?plate=${licensePlate}`);
    console.log("violationsData", violationsData);

    // Check if there are any violations
    if (violationsData && violationsData.length > 0) {
      console.log(userId, "userId" , vehicleData._id, "vehicleData._id");
      // Prepare the violations to include userId and vehicleId
      const violationsWithIds = await violationsData.map(violation => ({
        ...violation,
        user: userId,
        vehicle: vehicleData._id
      }));

      console.log("Violations with IDs:", violationsWithIds);
      console.log(JSON.stringify(violationsWithIds))
      // Send the violations to your backend to be stored
      const saveViolationsResponse = await fetch(`${REACT_APP_SERVER_URL}/violations/addViolations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ violations: violationsWithIds }) // Wrap the array in an object under the key 'violations'
      });

      if (!saveViolationsResponse.ok) {
        const errorText = await saveViolationsResponse.text();
        showMessage({
          message: "Error",
          description: errorText,
          type: "danger",
        });
        return;
      }

      // ... handle success, maybe update local state or navigate
      console.log("violations obtained from API");
      await fetchUpdatedVehicles();
      navigation.goBack();
    } else {
      console.log("No violations found for this vehicle.");
      // Handle the case where no violations are found, maybe set a state or show a message
    }
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