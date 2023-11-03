// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthStyles from '../styles/AuthStyles.js';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = () => {
    // Handle authentication logic
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
