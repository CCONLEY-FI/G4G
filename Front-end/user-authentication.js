// External library imports
import jwtDecode from 'jwt-decode';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from './utils.js';

// Helper function to perform API requests
async function performRequest(endpoint, method, body) {
  try {
    console.log(API_URL);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (error) {
    console.error(
      `Error during ${method} request to ${endpoint}:`,
      error.message,
    );
    throw error;
  }
}

const getUserId = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  } catch (error) {
    console.error('Error getting user ID:', error.message);
    throw error;
  }
};

const loginUser = async (username, password) => {
  const data = await performRequest('/login', 'POST', {username, password});
  await AsyncStorage.setItem('access_token', data.access_token);
  return data;
};

const createUser = async (username, password) => {
  return performRequest('/signup', 'POST', {username, password});
};

export {loginUser, createUser, getUserId};
