import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {loginUser, createUser} from './user-authentication'; // Adjusted import path
import theme from './theme.js'; // Ensure this path is correct
import tw from 'twrnc';

const AuthScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('login');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      setError('');
      navigation.navigate('Profile');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUser(username, password);
      setError('');
      Alert.alert('Signup Successful', 'Please log in.');
      setFormType('login'); // Switch to login form after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View
      style={[
        tw`flex-1 justify-center items-center p-4`,
        {backgroundColor: theme.colors.background},
      ]}>
      {error !== '' && (
        <Text style={theme.components.errorMessage}>{error}</Text>
      )}
      <TextInput
        style={theme.components.input}
        placeholder="Username"
        placeholderTextColor={theme.colors.textMuted}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={theme.components.input}
        placeholder="Password"
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <View style={tw`w-full px-4`}>
        {formType === 'login' ? (
          <>
            <Button
              title="Login"
              onPress={handleLogin}
              color={theme.colors.primary}
            />
            <Text onPress={() => setFormType('signup')} style={[tw`mt-4 text-center`, {color: theme.colors.secondary}]}>
              Don't have an account? Sign up.
            </Text>
          </>
        ) : (
          <>
            <Button
              title="Signup"
              onPress={handleSignup}
              color={theme.colors.secondary}
            />
            <Text onPress={() => setFormType('login')} style={[tw`mt-4 text-center`, {color: theme.colors.primary}]}>
              Already have an account? Log in.
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default AuthScreen;