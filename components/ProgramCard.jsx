import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ProgramCard = ({ name, onPress }) => {
    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.pressable,
                    { backgroundColor: pressed ? 'lightgrey' : 'white' },
                ]}
                onPress={onPress}
            >
                <Text style={styles.text}>{name}</Text>
            </Pressable>
        </View>
    );
};

export default ProgramCard;

const cardSize = 150; // Set the desired width and height of the card

const styles = StyleSheet.create({
    container: {
        width: cardSize,
        height: cardSize,
        borderRadius: 8,
        marginVertical: 5,
    },
    pressable: {
        flex: 1, // To fill the entire card
        borderRadius: 8,
        elevation: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: 'grey',
        justifyContent: 'center', // Center the text vertically
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center', // Center the text horizontally
    },
});
