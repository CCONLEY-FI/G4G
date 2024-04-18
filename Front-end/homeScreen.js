import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import tw from 'twrnc';
import theme from './theme.js';

const HomeScreen = ({navigation}) => {
  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-[${theme.colors.background}]`}>
      <Image style={theme.components.image} source={theme.images.logo} />
      <View style={tw`flex-1 justify-around items-center w-full`}>
        <TouchableOpacity
          style={[tw`px-6 py-2 rounded-lg`, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={{color: theme.colors.text}}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tw`px-6 py-2 rounded-lg`, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('PodsOverview')}>
          <Text style={{color: theme.colors.text}}>Pods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tw`px-6 py-2 rounded-lg`, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('Swipe')}>
          <Text style={{color: theme.colors.text}}>Swipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;