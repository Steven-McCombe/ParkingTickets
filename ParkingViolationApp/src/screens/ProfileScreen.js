// src/screens/ProfileScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Button } from 'react-native';
import { REACT_APP_SERVER_URL } from '../config';
import { Card } from 'react-native-elements';
import ProfileStyles from '../styles/ProfileStyles';
import { UserContext } from '../contexts/UserContext'; 
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from "../../utils/getUserData"
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
        const data = await getUserData();
        setUserData(data);
    };

    fetchUserData();
    fetchVehicles();  // Call fetchVehicles here to ensure it runs after fetchUserData
}, []);

  if (!authContext) {
    // Handle case where context is undefined
    console.error('AuthContext is undefined');
    return null;
  }

  const { user } = authContext;
console.log("user: " + user)
  useEffect(() => {
    fetchVehicles();
  }, []);

  const deleteVehicle = async (vehicleId) => {
    try {
        const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/deleteVehicle`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vehicleId }),
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
            console.error('Failed to delete vehicle:', errorText);
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

  const fetchVehicles = async () => {
    if (!user || !token) {
        // Handle missing user or token, e.g., by setting an error state
        setError('User not logged in');
        setLoading(false);
        return;
      }
    try {
        // Get the user ID from the user context
      const userId = user ? user._id : null;  
      const response = await fetch(`${REACT_APP_SERVER_URL}/vehicles/getVehicles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Update this line
        },
        body: JSON.stringify({ userId }),
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
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
        setLoading(false);
        setError('Failed to fetch vehicles');
    }
  };
  async function logout() {
    try {
      // Optional: Send a request to the server to invalidate the session.
      // const response = await fetch(`${REACT_APP_SERVER_URL}/auth/logout`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      //   },
      // });
      // if (!response.ok) {
      //   throw new Error('Logout failed');
      // }
  
      // Remove the session token and user from local storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
  
      // Optional: Update the application state to reflect the logout
      // ... (e.g., by using a state management library or context)
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <View style={ProfileStyles.container}>
        <Text style={ProfileStyles.boldText}>Profile Screen</Text>
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            userData && (
                <View>
                    <Text style={ProfileStyles.boldText}>Username: {userData.username}</Text>
                    <Text style={ProfileStyles.regularText}>Email: {userData.email}</Text>
                    {userData.licensePlates.map(plate => (
                        <Card key={plate._id} containerStyle={ProfileStyles.cardContainer}>
                            <Card.Title>{plate.nickName} - {plate.licensePlate}</Card.Title>
                            <Card.Divider />
                            <Text style={ProfileStyles.regularText}>License Type: {plate.licenseType}</Text>
                            <Text style={ProfileStyles.regularText}>State: {plate.state}</Text>
                            <View style={ProfileStyles.buttonContainer}>
                                <TouchableOpacity
                                    style={ProfileStyles.iconButton}
                                    onPress={() => navigation.navigate('EditVehicleScreen', { plate })}
                                >
                                    <Icon name="edit" size={24} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={ProfileStyles.iconButton}
                                    onPress={() => deleteVehicle(plate._id)}
                                >
                                    <Icon name="trash" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            )
        )}
        <Button title="Add Vehicle" onPress={() => navigation.navigate('AddVehicleScreen')} style={ProfileStyles.addButton}/>
        <Button title="Logout" onPress={() => logout()} />
    </View>
);
};

export default ProfileScreen;







