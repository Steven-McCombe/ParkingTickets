// src/screens/ProfileScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, RefreshControl, View, Text, TouchableOpacity, Button, SafeAreaView} from 'react-native';
import { REACT_APP_SERVER_URL } from '../config';
import { Card, ListItem } from 'react-native-elements';
import ProfileStyles from '../styles/ProfileStyles';
import { UserContext } from '../contexts/UserContext'; 
import { AuthContext } from '../contexts/AuthContext';
import { showMessage } from "react-native-flash-message";
import {getUserData} from "../../utils/getUserData";
import Icon from 'react-native-vector-icons/FontAwesome';
import { VehiclesContext } from '../contexts/VehiclesContext';
import { fetchVehicles } from '../../utils/fetchVehicles';

const ProfileScreen = ({ navigation }) => {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const { vehicles, setVehicles } = useContext(VehiclesContext);
  const { logout } = useContext(AuthContext);

  

  const VehicleItem = ({ vehicle }) => (
    <TouchableOpacity 
      style={ProfileStyles.listItemContainer}
      onPress={() => navigation.navigate('MainScreen', { vehicleId: vehicle._id })}
    >
      <View style={ProfileStyles.vehicleInfo}>
        <View>
          <Text style={ProfileStyles.listItemTitle}>
            {vehicle.nickName}
          </Text>
          <Text style={ProfileStyles.listItemSubtitle}>
            {vehicle.licensePlate}
          </Text>
          <Text style={ProfileStyles.listItemDetails}>
            License Type: {vehicle.licenseType}, State: {vehicle.state}
          </Text>
        </View>
        <TouchableOpacity onPress={() => deleteVehicle(vehicle._id)}>
          <Icon 
            name="trash" 
            size={24}
            color={ProfileStyles.deleteIcon.color}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );


  const getVehicles = async () => {
    try {
        setLoading(true);
        const vehiclesData = await fetchVehicles(authContext.user._id, token);
        setVehicles(vehiclesData);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (!authLoading && user && token) {
        getVehicles();  // This calls fetchVehicles internally
    }
}, [authLoading, user, token]);

  useEffect(() => {
    const fetchUserData = async () => {
        const data = await getUserData();
        setUserData(data);
    };
    fetchUserData();
}, []);


//log updated vehicles state
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
        const updatedVehicles = await fetchVehicles(authContext.user._id, token);
        setVehicles(updatedVehicles);
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
    <SafeAreaView style={ProfileStyles.container}>
      <ScrollView
        style={ProfileStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getVehicles} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={ProfileStyles.activityIndicator.color} />
        ) : vehicles.length === 0 ? (
          <Text style={ProfileStyles.noVehiclesText}>No vehicles found.</Text>
        ) : (
          vehicles.map((vehicle) => <VehicleItem key={vehicle._id} vehicle={vehicle} />)
        )}
      </ScrollView>
      <TouchableOpacity
        style={ProfileStyles.addVehicleButton}
        onPress={() => navigation.navigate('AddVehicleScreen')}
      >
        <Icon
          name="plus"
          size={24}
          color={ProfileStyles.addVehicleIcon.color}
        />
      </TouchableOpacity>
      {/* ... (rest of the return statement remains unchanged) */}
    </SafeAreaView>
  );
};

export default ProfileScreen;







