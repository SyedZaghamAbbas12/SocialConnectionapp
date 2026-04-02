import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LoginScreen from '../screens/auth/LoginScreen';
import TabNavigator from './TabNavigator';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AddPostScreen from '../screens/main/AddPostScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="AddPost" component={AddPostScreen} />
    </Stack.Navigator>
  );
}