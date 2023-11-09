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

  

  console.log('Vehicles ====:', vehicles);

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
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView
    style={ProfileStyles.container}
    refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getVehicles} />
    }
>
        {loading ? (
   <ActivityIndicator size="large" color="#0000ff" />
) : (
  vehicles.length === 0 ? (
    <Text>No vehicles found.</Text>
  ) : (
    vehicles && (
        <View>
        {vehicles.map(vehicle => (
            <ListItem 
                key={vehicle.licensePlate} 
                containerStyle={ProfileStyles.listItemContainer}
                onPress={() => navigation.navigate('MainScreen', { vehicleId: vehicle._id })}
            >
                <ListItem.Content>
                    <ListItem.Title style={ProfileStyles.listItemTitle}>
                        {vehicle.nickName}
                    </ListItem.Title>
                    <ListItem.Subtitle style={ProfileStyles.listItemSubtitle}>
                        {vehicle.licensePlate}
                    </ListItem.Subtitle>
                    <Text style={ProfileStyles.listItemDetails}>
                        License Type: {vehicle.licenseType}, State: {vehicle.state}
                    </Text>
                </ListItem.Content>
                <Icon 
                    name="trash" 
                    type="font-awesome" 
                    onPress={() => deleteVehicle(vehicle._id)} 
                    style={ProfileStyles.deleteIcon}
                />
            </ListItem>
        ))}
    </View>
    )
    )
  )}

    </ScrollView>
<TouchableOpacity
  style={ProfileStyles.addVehicleButton}
  onPress={() => navigation.navigate('AddVehicleScreen')}
>
  <Icon
    name="plus"
    type="font-awesome-5"
    style={ProfileStyles.addVehicleIcon}
  />
</TouchableOpacity>
    <Button title="Logout" onPress={logout} />
    <Button title="Main" onPress={() => navigation.navigate('MainScreen')} />
    </SafeAreaView>
);
};

export default ProfileScreen;







