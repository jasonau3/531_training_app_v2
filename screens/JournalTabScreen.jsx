import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { auth, db } from '../firebase';
import { getDocs, collection, doc } from 'firebase/firestore';

import {
    BACKGROUND_APP_COLOR,
    sortByTime,
    calculateHorizontalPadding,
} from '../Helpers.js';
import { FlatList } from 'react-native-web';

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
        const [name, week, day] = title.split('-').map((part) => part.trim());

        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        return `${formattedName} - Week ${week} - Day ${day}`;
    }

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${
            remainingSeconds < 10 ? '0' : ''
        }${remainingSeconds}`;
    }

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <FlatList
                data={workoutHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.title}>
                            {formatTitle(item.title)}
                        </Text>
                        <Text style={styles.duration}>
                            Duration:{' '}
                            {formatDuration(
                                item.endTime.seconds - item.startTime.seconds
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
});
