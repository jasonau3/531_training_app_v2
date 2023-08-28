import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const ExerciseCard = ({ name, isMainSet, sets, reps, weight }) => {
    const [iconColor, setIconColor] = useState('#333'); // Default color

    const handleEllipsisPress = () => {
        // TODO: Add functionality to the ellipsis

        setIconColor('#858383'); // Brighter color
        setTimeout(() => {
            setIconColor('#333'); // Restore the default color after a delay
        }, 300);
    };

    if (isMainSet) {
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.mainSetTitle}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Text>
                    <Pressable onPress={handleEllipsisPress}>
                        <MaterialIcons
                            name='more-vert'
                            size={18}
                            color={iconColor} // Use the dynamic color
                        />
                    </Pressable>
                </View>
                <View style={styles.setInformation}>
                    <Text>{sets} sets</Text>
                    <MaterialIcons
                        name='fiber-manual-record'
                        size={6}
                        color='#333'
                    />
                    <Text>{reps} reps</Text>
                    <MaterialIcons
                        name='fiber-manual-record'
                        size={6}
                        color='#333'
                    />
                    <Text>{weight} lbs</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.accessoryTitle}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </Text>
                <Pressable onPress={handleEllipsisPress}>
                    <MaterialIcons
                        name='more-vert'
                        size={18}
                        color={iconColor} // Use the dynamic color
                    />
                </Pressable>
            </View>
            <Text>{reps} reps</Text>
        </View>
    );
};

export default ExerciseCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        elevation: 2,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    mainSetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    accessoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    setInformation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});
