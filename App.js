import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HeaderComponent from './components/HeaderComponent';
import LoginScreen from './screens/LoginScreen';
import TabScreen from './screens/TabScreen';
import WorkoutScreen from './screens/WorkoutScreen';

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
                    name='5/3/1 Home'
                    component={TabScreen}
                    options={{
                        header: () => <HeaderComponent />,
                    }}
                />
                <Stack.Screen
                    name='Workout'
                    component={WorkoutScreen}
                    options={{
                        header: () => <HeaderComponent showBackBtn={true} />,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
