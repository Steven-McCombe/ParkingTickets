// src/screens/AuthScreen.js
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthStyles from '../styles/AuthStyles.js';
import { REACT_APP_SERVER_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { showMessage } from "react-native-flash-message";


const serverUrl = REACT_APP_SERVER_URL;
console.log("serverUrl: " + serverUrl)

// Validation schemas
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short!').required('Required'),
});

const registerSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short!').required('Required'),
  username: Yup.string().min(3, 'Username too short!').required('Required'),
});


const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('token: ' + token);
      if (token) {
        // Navigate to MainNavigator
        navigation.navigate('ProfileScreen');
      }
    };
  
    checkToken();
  }, [navigation]);

  const handleAuth = async () => {
    const url = isLogin ? `${REACT_APP_SERVER_URL}/auth/login` : `${REACT_APP_SERVER_URL}/auth/register`;
    const payload = {
        email,
        password,
        ...(isLogin ? {} : { username }),  // Include the username only if registering
    };

    try {
        // Choose the correct schema based on the isLogin state
        const validationSchema = isLogin ? loginSchema : registerSchema;
        await validationSchema.validate({ email, password, username }, { abortEarly: false });
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            showMessage({
                message: errorText,
                type: "danger",
            });
            console.error('Network response was not ok', response.statusText);
            return;
        }

        else {
            const data = await response.json();
            console.log('Response data:', data);  // Log the entire response data to check its structure
            
            if (data.token) {
                await AsyncStorage.setItem('userToken', data.token);
            } else {
                console.error('Token is undefined');
            }

            // Call fetchUserData to fetch the user data
            const userData = await fetchUserData();
            if (userData) {
              await AsyncStorage.setItem('user', JSON.stringify(userData));
          } else {
              console.error('User data is undefined');
          }
            
            showMessage({
                message: isLogin ? "Login successful!" : "Registration successful!",
                type: "success",
                autoHide: true,
                duration: 3000,
            });
            navigation.navigate('ProfileScreen');
        }
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            // Input validation failed
            showMessage({
                message: "Input Error",
                description: error.errors.join('\n'),
                type: "danger",
                autoHide: true,
                duration: 3000,  // hide the message after 3 seconds
            });
        }
        console.error('Error:', error);
    }
};


  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${REACT_APP_SERVER_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch user data:', errorText);
        return;
      }
  
      const userData = await response.json();
      console.log('User data:', userData);
      return userData;  // Optionally save this data to state or AsyncStorage, or return it to be handled elsewhere
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  return (
    <View style={AuthStyles.container}>
      <Text style={AuthStyles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      {!isLogin && (
        <Input
          placeholder='Username'
          leftIcon={<Icon name='user' size={24} color='black' />}
          onChangeText={value => setUsername(value)}
        />
      )}
      <Input
        placeholder='Email'
        leftIcon={<Icon name='envelope' size={24} color='black' />}
        onChangeText={value => setEmail(value)}
      />
      <Input
        placeholder='Password'
        leftIcon={<Icon name='lock' size={24} color='black' />}
        secureTextEntry
        onChangeText={value => setPassword(value)}
      />
      <Button title={isLogin ? 'Login' : 'Register'} onPress={handleAuth} />
      <TouchableOpacity onPress={() => setIsLogin(prevState => !prevState)}>
        <Text style={AuthStyles.toggleText}>
          {isLogin ? 'Need an account? Register.' : 'Have an account? Login.'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;
