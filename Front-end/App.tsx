import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import theme from './theme.js';
import AuthScreen from './authScreen.js';
import HomeScreen from './homeScreen.js';
import SplashScreen from './splashScreen.js';
import ProfileScreen from './profileScreen.js';
import SwipeScreen from './swipeScreen.js';
import PodsOverview from './podsOverview.js';
import PodDisplay from './podDisplay.js';

// Define the types for your navigation routes
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Home: undefined;
  Profile: undefined;
  Swipe: undefined;
  PodsOverview: undefined;
  PodDisplay: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Swipe" component={SwipeScreen} />
          <Stack.Screen name="PodsOverview" component={PodsOverview} />
          <Stack.Screen name="PodDisplay" component={PodDisplay} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
