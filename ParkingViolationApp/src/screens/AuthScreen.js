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

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short!').required('Required'),
  username: Yup.string().min(3, 'Username too short!').required('Required'),  // Only required for registration
});

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log("token: " + token)
      if(token){
        // Navigate to main app screen
        navigation.navigate('MainScreen');
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
      // Validate the input
      await schema.validate({ email, password, username }, { abortEarly: false });
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

      const data = await response.json();
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('userToken', data.token);
       // Show success message
       
    showMessage({
      message: isLogin ? "Login successful!" : "Registration successful!",
      type: "success",
      autoHide: true,
      duration: 3000,  // hide the message after 3 seconds
    });

      // Navigate to another screen
      navigation.navigate('MainScreen');  // Replace 'MainScreen' with the name of your main screen

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
