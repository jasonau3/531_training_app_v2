import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { collection, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { PRIMARY_COLOR } from '../Color.js';

const UpdatePRComponent = ({ personalRecords, setPersonalRecords }) => {
    const [editedRecords, setEditedRecords] = useState([]);

    const handleInputChange = (index, field, value) => {
        const newEditedRecords = [...editedRecords];
        newEditedRecords[index] = {
            ...newEditedRecords[index],
            [field]: value,
        };
        setEditedRecords(newEditedRecords);
    };

    const saveChangesToDatabase = async (updatedRecords) => {
        const users = collection(db, 'users');
        const userDocRef = doc(users, auth.currentUser.uid);
        const personalRecordsCollectionRef = collection(
            userDocRef,
            'personal_records'
        );

        for (const updatedRecord of updatedRecords) {
            const { id, ...recordData } = updatedRecord;
            const personalRecordDocRef = id
                ? doc(personalRecordsCollectionRef, id)
                : doc(personalRecordsCollectionRef);

            await setDoc(personalRecordDocRef, recordData);
        }
    };

    const handleSaveChanges = () => {
        const updatedRecords = personalRecords.map((pr, index) => ({
            ...pr,
            ...editedRecords[index],
        }));

        setPersonalRecords(updatedRecords);
        setEditedRecords([]);

        saveChangesToDatabase(updatedRecords);
    };

    return (
        <View>
            <Text style={styles.heading}>Update PRs</Text>
            {personalRecords &&
                personalRecords.map((pr, index) => (
                    <View key={pr.id} style={styles.pr_container}>
                        {['press', 'squat', 'deadlift', 'bench'].map(
                            (exercise) => (
                                <View
                                    style={styles.rowContainer}
                                    key={exercise}
                                >
                                    <Text style={styles.pr_label}>
                                        {exercise.charAt(0).toUpperCase() +
                                            exercise.slice(1)}
                                        :
                                    </Text>
                                    <TextInput
                                        style={styles.pr_input}
                                        value={
                                            editedRecords[index]?.[
                                                exercise
                                            ]?.toString() ||
                                            pr[exercise].toString()
                                        }
                                        onChangeText={(text) =>
                                            handleInputChange(
                                                index,
                                                exercise,
                                                parseFloat(text) || 0
                                            )
                                        }
                                    />
                                    <Text style={styles.unitLabel}>lbs</Text>
                                </View>
                            )
                        )}
                    </View>
                ))}
            <Pressable onPress={handleSaveChanges} style={styles.save_button}>
                <Text style={styles.save_button_text}>Save Changes</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        paddingLeft: 5,
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    pr_container: {
        backgroundColor: '#0F0F0F',
        borderRadius: 5,
        padding: 10,
    },
    pr_label: {
        fontSize: 24,
        color: '#fff',
        paddingLeft: 15,
        paddingBottom: 5,
    },
    pr_input: {
        marginHorizontal: 5,
        fontSize: 24,
        width: 50,
        color: '#fff',
        textAlign: 'center',
    },
    save_button: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
    },
    save_button_text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    unitLabel: {
        fontSize: 24,
        color: '#fff',
        marginLeft: 5,
    },
});

export default UpdatePRComponent;
