// src/screens/ProfileScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text, TouchableOpacity, Button } from 'react-native';
import { REACT_APP_SERVER_URL } from '../config';
import { Card } from 'react-native-elements';
import ProfileStyles from '../styles/ProfileStyles';
import { UserContext } from '../contexts/UserContext'; 
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from "../../utils/getUserData"
import Icon from 'react-native-vector-icons/FontAwesome';
import { VehiclesContext } from '../contexts/VehiclesContext';

const ProfileScreen = ({ navigation }) => {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const { vehicles, setVehicles } = useContext(VehiclesContext);
  const { logout } = useContext(AuthContext);

  

  console.log('Vehicles ====:', vehicles);

  const fetchVehicles = async () => {
    console.log('Fetching vehicles...');
    console.log('authContext.user:', authContext.user);
    console.log('token:', token);
    
    if (!authContext.user || !token) {
        console.log('User not logged in or token not available');
        setError('User not logged in');
        setLoading(false);
        return;
    }
    try {
        const userId = authContext.user._id;
        console.log('userId:', userId);  // Log the userId to the console
        const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/getVehicles?userId=${userId}`, {
            method: 'GET',  // Keep the method as GET
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            showMessage({
                message: "Error",
                description: errorText,
                type: "danger",
                autoHide: true,
                duration: 3000,
            });
            console.error('Failed to fetch vehicles:', errorText);
            setLoading(false);
            return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);  // Log fetched data
        setVehicles(data);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
        setError('Failed to fetch vehicles');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
        const data = await getUserData();
        setUserData(data);
    };
    fetchUserData();
}, []);

useEffect(() => {
  if (!authLoading && user && token) {
      fetchVehicles();
  }
}, [authLoading, user, token]);



  // New useEffect to log updated vehicles state
// Inside ProfileScreen component
useEffect(() => {
  console.log('ProfileScreen rendered');
}, [vehicles]);

  const deleteVehicle = async (vehicleId) => {
    try {
        const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/deleteVehicle/${vehicleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: authContext.user._id }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            showMessage({
                message: "Error",
                description: errorText,
                type: "danger",
                autoHide: true,
                duration: 3000,
            });
            console.error('Failed to delete vehicle:' + vehicleId , errorText);
            return;
        }

        // If the deletion was successful, re-fetch the vehicle list
        fetchVehicles();
        showMessage({
            message: "Vehicle Deleted",
            description: "The vehicle has been successfully deleted.",
            type: "success",
            autoHide: true,
            duration: 3000,
        });
    } catch (error) {
        showMessage({
            message: "Error",
            description: error.toString(),
            type: "danger",
            autoHide: true,
            duration: 3000,
        });
        console.error('Error deleting vehicle:', error);
    }
};

  return (
    <ScrollView style={ProfileStyles.container}>
        <Text style={ProfileStyles.boldText}>Profile Screen</Text>
        {loading ? (
   <ActivityIndicator size="large" color="#0000ff" />
) : (
  vehicles.length === 0 ? (
    <Text>No vehicles found.</Text>
  ) : (
    vehicles && (
      <View>
              {vehicles.map(vehicle => (
              <Card key={vehicle.licensePlate} containerStyle={ProfileStyles.cardContainer}>
                      <Card.Title>{vehicle.nickName} - {vehicle.licensePlate}</Card.Title>
                      <Card.Divider />
                      <Text style={ProfileStyles.regularText}>License Type: {vehicle.licenseType}</Text>
                      <Text style={ProfileStyles.regularText}>State: {vehicle.state}</Text>
                      <View style={ProfileStyles.buttonContainer}>
                          <TouchableOpacity
                              style={ProfileStyles.iconButton}
                              onPress={() => navigation.navigate('EditVehicleScreen', { vehicle })}
                          >
                              <Icon name="edit" size={24} color="#000" />
                          </TouchableOpacity>
                          <TouchableOpacity
                              style={ProfileStyles.iconButton}
                              onPress={() => deleteVehicle(vehicle._id)}
                          >
                              <Icon name="trash" size={24} color="#000" />
                          </TouchableOpacity>
                      </View>
                  </Card>
              ))}
          </View>
    )
    )
  )}
        <Button title="Add Vehicle" onPress={() => navigation.navigate('AddVehicleScreen')} style={ProfileStyles.addButton}/>
        <Button title="Logout" onPress={logout} />
        <Button title="Refresh" onPress={fetchVehicles} />

    </ScrollView>
);
};

export default ProfileScreen;







