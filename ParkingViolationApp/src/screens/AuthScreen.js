// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import AuthStyles from '../styles/AuthStyles.js';
import { REACT_APP_SERVER_URL} from '../config';



const serverUrl = REACT_APP_SERVER_URL;
console.log("serverUrl: " + serverUrl)

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = async () => {
    const url = isLogin ? `${REACT_APP_SERVER_URL}/auth/login` : `${REACT_APP_SERVER_URL}/auth/register`;
    const payload = {
      email,
      password,
      ...(isLogin ? {} : { username }),  // Include the username only if registering
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        // Handle error (e.g., show an error message to the user)
        console.error('Network response was not ok', response.statusText);
        // Check if the response is JSON
        if (response.headers.get('Content-Type').includes('application/json')) {
          const data = await response.json();
          console.error(data);
        } else {
          const text = await response.text();
          console.error(text);
        }
        return;
      }
  
      const data = await response.json();
      // Handle success (e.g., navigate to another screen)
      console.log(data);
  
    } catch (error) {
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
