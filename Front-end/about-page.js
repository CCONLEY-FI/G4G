// About Page

import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import tw from 'twrnc';
import {colors, components} from './theme.js';
import {API_URL} from './utils.js'; 

const AboutPage = ({navigation}) => {
  const [apiHealth, setApiHealth] = useState('');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        setApiHealth(data.message); // Assuming the /health endpoint returns a JSON with a message field
      } catch (error) {
        console.error('API health check failed:', error);
        setApiHealth('API is down');
      }
    };

    checkApiHealth();
  }, []);

  return (
    <View
      style={tw`flex-1 justify-center items-center p-4 bg-${colors.background}`}>
      <Text style={[tw`text-${colors.text}`, components.paragraph]}>
        App Name: GamePod: 1.0 GitHub Link: https://github.com/CConley-FI
      </Text>
      {apiHealth && (
        <Text style={tw`p-4 text-white`}>API Status: {apiHealth}</Text>
      )}
      <Button
        title="Return"
        onPress={() => navigation.navigate('Splash')}
        // Button color cannot be set using twrnc, set directly or use a predefined color from your theme
        color={colors.primary}
      />
    </View>
  );
};

export default AboutPage;
