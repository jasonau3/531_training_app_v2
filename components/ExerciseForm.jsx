import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ExerciseForm = ({
    isWideScreen,
    index,
    set,
    type, // 'main' or 'accessory'
    handleEditSet,
    handleDeleteSet,
}) => {
    const handleEdit = (field, newValue) => {
        handleEditSet(index, type, field, newValue);
    };

    return (
        <View
            style={[
                isWideScreen
                    ? styles.editableSetRowContainer
                    : styles.editableSetColumnContainer,
            ]}
        >
            <View style={styles.accessoryInfoContainer}>
                <Text style={styles.setNumberLabel}>
                    {type === 'main' ? 'Set' : 'Accessory'} #{index + 1}
                </Text>
                <MaterialIcons
                    name='delete'
                    size={20}
                    color='#333'
                    onPress={() => handleDeleteSet(index, type)}
                    style={styles.deleteIcon}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder='Sets'
                value={set.sets.toString()}
                onChangeText={(newSets) => handleEdit('sets', newSets)}
                keyboardType='numeric'
            />
            <TextInput
                style={styles.input}
                placeholder='Reps'
                value={set.reps.toString()}
                onChangeText={(newReps) => handleEdit('reps', newReps)}
                keyboardType='numeric'
            />
            <TextInput
                style={styles.input}
                placeholder='Percentage'
                value={set.percentage.toString()}
                onChangeText={(newPercentage) =>
                    handleEdit('percentage', newPercentage)
                }
                keyboardType='numeric'
            />
        </View>
    );
};

export default ExerciseForm;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        marginRight: 10,
        borderRadius: 5,
        width: '25%',
    },
});
