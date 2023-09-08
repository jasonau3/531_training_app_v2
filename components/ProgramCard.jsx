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

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },
    pressable: {
        borderRadius: 8,
        elevation: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: 'grey',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
