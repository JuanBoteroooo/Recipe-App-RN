import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailRecipeScreen from '../screens/DetailRecipeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import AddRecipeToGroupScreen from '../screens/AddRecipeToGroupScreen';

// Nuevo esquema de colores GastroShare
const COLORS = {
  primary: '#ffffff',
  accent: '#FF6B00',
  inactive: '#999999',
  border: '#E5E5E5',
  background: '#ffffff'
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          height: 90,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10, // sombra para Android
          shadowColor: '#000', // sombra para iOS
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -1 },
          shadowRadius: 4
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Grupos') {
            iconName = 'restaurant-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Grupos" component={GroupsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
        <Stack.Screen name="DetailRecipe" component={DetailRecipeScreen} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
        <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
        <Stack.Screen name="AddRecipeToGroup" component={AddRecipeToGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
