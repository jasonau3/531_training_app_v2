import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { auth, db } from '../firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';

import {
    BACKGROUND_APP_COLOR,
    sortByTime,
    calculateHorizontalPadding,
} from '../Helpers.js';

const JournalTabScreen = () => {
    const isFocused = useIsFocused();
    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    const [workoutHistory, setWorkoutHistory] = useState(null);

    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
    const workoutHistoryCollectionRef = collection(
        userDocRef,
        'workout_history'
    );

    // Fetch workout history only when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // get workout data
                const workoutHistorySnapshot = await getDocs(
                    workoutHistoryCollectionRef
                );
                const workoutHistoryData = workoutHistorySnapshot.docs.map(
                    (doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })
                );
                const sortedData = sortByTime(workoutHistoryData);
                setWorkoutHistory(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isFocused]);

    function formatTitle(title) {
        const [week, day] = title.split('-').map((part) => part.trim());

        return `Week ${week} - Day ${day}`;
    }

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${
            remainingSeconds < 10 ? '0' : ''
        }${remainingSeconds}`;
    }

    const handleDeleteJournal = async (docId) => {
        console.log(docId);

        const documentRef = doc(
            db,
            'users',
            auth.currentUser.uid,
            'workout_history',
            docId
        );

        try {
            // Delete the document
            await deleteDoc(documentRef);

            // Remove the deleted item from the state
            setWorkoutHistory((prevWorkoutHistory) =>
                prevWorkoutHistory.filter((item) => item.id !== docId)
            );

            console.log('Document successfully deleted.');
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <FlatList
                data={workoutHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.itemContent}>
                            <Text style={styles.title}>
                                {formatTitle(item.title)}
                            </Text>
                            <Text style={styles.duration}>
                                Duration:{' '}
                                {formatDuration(
                                    item.endTime.seconds -
                                        item.startTime.seconds
                                )}
                            </Text>
                            <Text style={styles.time}>
                                Start Time:{' '}
                                {new Date(
                                    item.startTime.seconds * 1000
                                ).toLocaleString()}
                            </Text>
                            <Text style={styles.time}>
                                End Time:{' '}
                                {new Date(
                                    item.endTime.seconds * 1000
                                ).toLocaleString()}
                            </Text>
                        </View>
                        <MaterialIcons
                            name='delete'
                            size={20}
                            color='#333'
                            onPress={() => handleDeleteJournal(item.id)}
                            style={styles.deleteIcon}
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default JournalTabScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_APP_COLOR,
        paddingVertical: 10,
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingVertical: 10,
        flexDirection: 'row', // Horizontal layout
        justifyContent: 'space-between', // Put items at the ends (left and right)
        alignItems: 'center', // Vertically center items
    },
    itemContent: {
        flex: 1, // Takes up remaining horizontal space
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    duration: {
        fontSize: 16,
    },
    time: {
        fontSize: 14,
        color: 'gray',
    },
    deleteIcon: {
        marginRight: 30,
    },
});
