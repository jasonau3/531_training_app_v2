import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const WeekButton = ({ label, onPress, isCompleted }) => {
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
                    isCompleted ? styles.containerCompleted : null,
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
        backgroundColor: '#E7E7E7',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 15,
        marginRight: 10,
    },
    containerPressed: {
        backgroundColor: '#C2C2C2',
    },
    containerCompleted: {
        backgroundColor: '#B8B8B8',
    },
    label: {
        color: '#393939',
        fontSize: 16,
        fontWeight: 'bold',
    },
    labelPressed: {
        color: '#ffffff',
    },
});

export default WeekButton;
