import React from 'react';
import {
  TextInput,
  Button,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import tw from 'twrnc';

export const API_URL = 'http://10.0.2.2:5000';

// Custom Input Component
export const CustomInput = ({
  label,
  value,
  onChangeText,
  style,
  keyboardType,
}) => (
  <View style={tw`mb-4`}>
    <Text style={tw`text-lg font-bold mb-2`}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[tw`border border-gray-400 p-2`, style]}
      keyboardType={keyboardType}
    />
  </View>
);

// Custom Button Component
export const CustomButton = ({title, onPress, style}) => (
  <Button title={title} onPress={onPress} style={style} />
);

// Decode the JWT to get the user ID
export const getUserIdFromToken = async () => {
  const token = await AsyncStorage.getItem('access_token');
  console.log('token:', token)
  if (!token) throw new Error('No token found');
  const decoded = jwtDecode(token);
  console.log('decoded:', decoded);
  return decoded.user_id;
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }
    await AsyncStorage.setItem('access_token', data.access_token);
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const fetchWithAuth = async (endpoint, method = 'GET', body = null) => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const headers = {'Content-Type': 'application/json'};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
      method: method,
      headers: headers,
      ...(body && {body: JSON.stringify(body)}),
    };
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Network error or invalid response');
  }
};

export const updateEntityImage = async (entityType, entityId, imageUrl) => {
  let endpoint;
  if (entityType === 'user') {
    endpoint = `/profile/${entityId}/image`;
  } else if (entityType === 'pod') {
    endpoint = `/pods/${entityId}/image`;
  } else {
    throw new Error('Invalid entity type');
  }

  try {
    const response = await fetchWithAuth(endpoint, 'PATCH', {
      image_url: imageUrl,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update image URL');
    }
    console.log('Image URL updated successfully:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Updating image URL error:', error);
    throw error;
  }
};

// Save user profile to the backend
export const saveProfile = async (userId, profileData) => {
  if (!userId) throw new Error('User ID is null');
  try {
    const response = await fetchWithAuth(
      `/profile/${userId}`,
      'PATCH',
      profileData,
    );
    return response;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};


// PodItem component
export const PodItem = ({pod, onPress, onDismiss}) => (
  <View style={tw`mb-4 p-4 bg-gray-700 rounded-lg flex-row items-center`}>
    <Image
      source={{uri: pod.image_url}}
      style={tw`h-20 w-20 rounded-md`}
      resizeMode="cover"
    />
    <View style={tw`flex-1 ml-4`}>
      <Text style={tw`text-xl font-bold text-white`}>{pod.pod_name}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={tw`text-blue-400 mt-2`}>More</Text>
      </TouchableOpacity>
    </View>
    {onDismiss && (
      <TouchableOpacity onPress={onDismiss}>
        <Text style={tw`text-red-500 text-xl`}>X</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ExpandButton component
export const ExpandButton = ({isExpanded, onPress}) => (
  <TouchableOpacity
    style={tw`mt-2 p-2 bg-blue-500 rounded-lg`}
    onPress={onPress}
  >
    <Text style={tw`text-white text-center`}>
      {isExpanded ? 'Show Less' : 'Show More'}
    </Text>
  </TouchableOpacity>
);

// Dismiss a pod
export const dismissPod = async podId => {
  return await fetchWithAuth(`/dismissed_pod/${podId}`, 'POST');
};

// Join a pod
export const joinPod = async podId => {
  return await fetchWithAuth(`/pods/${podId}/join`, 'POST');
};

// Leave a pod
export const leavePod = async podId => {
  return await fetchWithAuth(`/pods/${podId}/leave`, 'POST');
};

// Create a pod
export const createPod = async podData => {
  return await fetchWithAuth('/pods', 'POST', podData);
};

// Get pod for swipe
export const getPodForSwipe = async () => {
  return await fetchWithAuth('/get_pod_for_swipe', 'GET');
};

export const createUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }
    await AsyncStorage.setItem('access_token', data.access_token); 
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};