import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AddPostScreen from '../screens/main/AddPostScreen'; // ✅ added
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute', borderTopWidth: 0, elevation: 0 },
        tabBarBackground: () => <BlurView intensity={80} tint="dark" style={{ flex: 1 }} />,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} 
      />

      <Tab.Screen 
        name="Add" 
        component={AddPostScreen} // ✅ updated to AddPostScreen
        options={{ tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={32} color={COLORS.accent} /> }} 
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}