import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from './theme.js'; 
import tw from 'twrnc'; 

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Auth');
    }, 5000); // Navigate after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigation]);

  return (
    <TouchableOpacity
      style={[tw`flex-1 justify-center items-center w-full h-full`, { backgroundColor: theme.colors.background }]}
      onPress={() => navigation.navigate('Auth')}>
      <Image source={theme.images.logo} style={tw`w-full h-full`} resizeMode="cover" />
    </TouchableOpacity>
  );
};

export default SplashScreen;