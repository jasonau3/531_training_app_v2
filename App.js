import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HeaderComponent from './components/HeaderComponent';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import ProgramEditorScreen from './screens/ProgramEditorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        header: () => <HeaderComponent />, // Show custom header component
                    }}
                />
                <Stack.Screen
                    name='Workout'
                    component={WorkoutScreen}
                    options={{
                        header: () => <HeaderComponent showBackBtn={true} />, // Show custom header component
                    }}
                />
                <Stack.Screen
                    name='Program_editor'
                    component={ProgramEditorScreen}
                    options={{
                        header: () => <HeaderComponent showBackBtn={true} />, // Show custom header component
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
