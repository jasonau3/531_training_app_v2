import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { PRIMARY_COLOR } from '../Color.js';

const WorkoutDayCard = ({ label, onPress }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View
                style={[
                    styles.container,
                    isPressed ? styles.containerPressed : null,
                ]}
            >
                <Text
                    style={[
                        styles.label,
                        isPressed ? styles.labelPressed : null,
                    ]}
                >
                    {label}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 15,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    containerPressed: {
        backgroundColor: '#fff',
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    labelPressed: {
        color: PRIMARY_COLOR,
    },
});

export default WorkoutDayCard;
