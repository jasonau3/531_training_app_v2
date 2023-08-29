import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import HomeTabScreen from './HomeTabScreen.jsx';
import JournalTabScreen from './JournalTabScreen.jsx';
import ProgramTabScreen from './ProgramTabScreen.jsx';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'red',
                tabStyle: {
                    fontWeight: 'bold',
                },
                labelStyle: {
                    fontSize: 16,
                },
            }}
        >
            <Tab.Screen
                name='Home'
                component={HomeTabScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='home' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                }}
            />
            <Tab.Screen
                name='Program'
                component={ProgramTabScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Program',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name='dumbbell' color={color} size={18} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                }}
            />
            <Tab.Screen
                name='Journal'
                component={JournalTabScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Journal',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='book' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabScreen;
