import { StyleSheet, Text, Pressable } from 'react-native';
import React, { useState } from 'react';

import { PRIMARY_COLOR } from '../Color.js';

const PrimaryButton = ({ onPress, label }) => {
    const [isButtonPressed, setIsButtonPressed] = useState(false);

    const handlePressIn = () => {
        setIsButtonPressed(true);
    };

    const handlePressOut = () => {
        setIsButtonPressed(false);
    };

    const buttonStyles = [
        styles.primary_button,
        isButtonPressed && styles.primary_button_pressed,
    ];

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={buttonStyles}
        >
            <Text style={styles.primary_button_text}>{label}</Text>
        </Pressable>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    primary_button: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
    },
    primary_button_text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    primary_button_pressed: {
        backgroundColor: PRIMARY_COLOR + '80',
    },
});
