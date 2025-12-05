import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import HomeScreen from "../screens/HomeScreen";

import AdminLoginScreen from "../screens/AdminLoginScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";

import PlaceDetailsScreen from "../screens/PlaceDetailsScreen";
import BookPassScreen from "../screens/BookPassScreen";
import SuperAdminDashboard from "../screens/SuperAdminDashboard";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* USER AUTH */}
      <Stack.Screen name="Auth" component={AuthNavigator} />

      {/* MAIN USER HOME */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* PLACE DETAILS & BOOKING */}
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      <Stack.Screen name="BookPass" component={BookPassScreen} />

      {/* ADMIN ROUTES */}
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />


    </Stack.Navigator>
  );
}
