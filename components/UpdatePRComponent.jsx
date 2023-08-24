import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { collection, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const UpdatePRComponent = ({ personalRecords, setPersonalRecords }) => {
    console.log(personalRecords);

    const [editedRecords, setEditedRecords] = useState([]);

    // ONLY CHANGES THE USER SCREEN, NOT THE DATABASE
    const handleInputChange = (index, field, value) => {
        const newEditedRecords = [...editedRecords];
        newEditedRecords[index] = {
            ...newEditedRecords[index],
            [field]: value,
        };
        setEditedRecords(newEditedRecords);
    };

    // UPLOAD TO DATABASE
    const handleSaveChanges = async () => {
        // First, save changes to personal records to update user screen
        const updatedRecords = personalRecords.map((pr, index) => {
            return { ...pr, ...editedRecords[index] };
        });
        setPersonalRecords(updatedRecords);
        setEditedRecords([]);

        // Then, save to collection
        const users = collection(db, 'users');
        const userDocRef = doc(users, auth.currentUser.uid);
        const personalRecordsCollectionRef = collection(
            userDocRef,
            'personal_records'
        );

        // Update documents based on the updatedRecords array
        for (const updatedRecord of updatedRecords) {
            const { id, ...recordData } = updatedRecord;
            const personalRecordDocRef = id
                ? doc(personalRecordsCollectionRef, id)
                : doc(personalRecordsCollectionRef); // Creating a new document

            await setDoc(personalRecordDocRef, recordData);
        }
    };

    return (
        <View>
            <Text style={styles.heading}>Update PRs</Text>
            {personalRecords &&
                personalRecords.map((pr, index) => (
                    <View key={pr.id} style={styles.pr_container}>
                        <Text style={styles.pr_label}>
                            Press:
                            <TextInput
                                style={styles.pr_input}
                                value={
                                    editedRecords[index]?.press?.toString() ||
                                    pr.press.toString()
                                }
                                onChangeText={(text) =>
                                    handleInputChange(
                                        index,
                                        'press',
                                        parseFloat(text) || 0
                                    )
                                }
                            />
                            lbs
                        </Text>
                        <Text style={styles.pr_label}>
                            Squat:
                            <TextInput
                                style={styles.pr_input}
                                value={
                                    editedRecords[index]?.squat?.toString() ||
                                    pr.squat.toString()
                                }
                                onChangeText={(text) =>
                                    handleInputChange(
                                        index,
                                        'squat',
                                        parseFloat(text) || 0
                                    )
                                }
                            />
                            lbs
                        </Text>
                        <Text style={styles.pr_label}>
                            Deadlift:
                            <TextInput
                                style={styles.pr_input}
                                value={
                                    editedRecords[
                                        index
                                    ]?.deadlift?.toString() ||
                                    pr.deadlift.toString()
                                }
                                onChangeText={(text) =>
                                    handleInputChange(
                                        index,
                                        'deadlift',
                                        parseFloat(text) || 0
                                    )
                                }
                            />
                            lbs
                        </Text>
                        <Text style={styles.pr_label}>
                            Bench:
                            <TextInput
                                style={styles.pr_input}
                                value={
                                    editedRecords[index]?.bench?.toString() ||
                                    pr.bench.toString()
                                }
                                onChangeText={(text) =>
                                    handleInputChange(
                                        index,
                                        'bench',
                                        parseFloat(text) || 0
                                    )
                                }
                            />
                            lbs
                        </Text>
                    </View>
                ))}
            <TouchableOpacity
                onPress={handleSaveChanges}
                style={styles.save_button}
            >
                <Text style={styles.save_button_text}>Save Changes</Text>
            </TouchableOpacity>
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
        width: 40,
        color: '#fff',
        textAlign: 'center',
    },
    save_button: {
        backgroundColor: '#FF0000',
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
});

export default UpdatePRComponent;
