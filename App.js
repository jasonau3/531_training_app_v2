import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        header: () => <Header />, // Show custom header component
                    }}
                />
                <Stack.Screen
                    name='Workout'
                    component={WorkoutScreen}
                    options={{
                        header: () => <Header showBackBtn={true} />, // Show custom header component
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
