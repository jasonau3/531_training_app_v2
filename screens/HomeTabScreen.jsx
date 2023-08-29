import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import { auth, db } from '../firebase';
import {
    getDocs,
    collection,
    doc,
    query,
    orderBy,
    limit,
} from 'firebase/firestore';

import UpdatePRComponent from '../components/UpdatePRComponent';
import WeekButton from '../components/WeekButton';
import WorkoutDayCard from '../components/WorkoutDayCard';
import {
    BACKGROUND_APP_COLOR,
    sortByName,
    getRecentWorkoutWeek,
    calculateHorizontalPadding,
} from '../Helpers.js';

const HomeTabScreen = () => {
    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    const [personalRecords, setPersonalRecords] = useState(null);
    const [myWorkout, setMyWorkout] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(1);

    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
    const personalRecordsCollectionRef = collection(
        userDocRef,
        'personal_records'
    );
    const workoutHistoryCollectionRef = collection(
        userDocRef,
        'workout_history'
    );
    const workoutsCollectionRef = collection(db, 'workouts');

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // Fetch data only when the component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // get personal records data
                const personalRecordsSnapshot = await getDocs(
                    personalRecordsCollectionRef
                );
                const personalRecordsData = personalRecordsSnapshot.docs.map(
                    (doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })
                );
                setPersonalRecords(personalRecordsData);

                // get workout data
                const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                const workoutsData = workoutsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const sortedData = sortByName(workoutsData);
                setMyWorkout(sortedData);

                // get most recent workout and set the current week to that week
                const q = query(
                    workoutHistoryCollectionRef,
                    orderBy('startTime', 'desc'),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const latestWorkout = querySnapshot.docs[0].data();
                    const titleParts = latestWorkout.title.split(' - ');
                    const result = getRecentWorkoutWeek(
                        parseInt(titleParts[1]),
                        parseInt(titleParts[2])
                    );
                    setCurrentWeek(result);
                } else {
                    setCurrentWeek(1); // default to week 1 if no workouts have been done yet
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, [isFocused]);

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <ScrollView>
                <View style={styles.week_btns}>
                    <ScrollView horizontal={true}>
                        {[1, 2, 3, 4].map((week) => {
                            return (
                                <WeekButton
                                    label={`Week ${week}`}
                                    onPress={() => setCurrentWeek(week)}
                                    isCompleted={currentWeek === week}
                                    key={week}
                                />
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.day_btns}>
                    {myWorkout &&
                        myWorkout
                            .filter((workout) => workout.week === currentWeek)
                            .map((workout) => {
                                return (
                                    <WorkoutDayCard
                                        label={`Day ${workout.day} - ${
                                            workout.mainExercise
                                                .charAt(0)
                                                .toUpperCase() +
                                            workout.mainExercise.slice(1)
                                        }`}
                                        onPress={() =>
                                            navigation.push('Workout', {
                                                week: workout.week,
                                                day: workout.day,
                                                personalRecords:
                                                    personalRecords,
                                                workout: workout,
                                            })
                                        }
                                        key={workout.id}
                                    />
                                );
                            })}
                </View>
                <UpdatePRComponent
                    personalRecords={personalRecords}
                    setPersonalRecords={setPersonalRecords}
                />
            </ScrollView>
        </View>
    );
};

export default HomeTabScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_APP_COLOR,
        paddingVertical: 10,
    },
    week_btns: {
        flex: 0.2,
        flexDirection: 'row',
    },
    day_btns: {
        flex: 1,
    },
});
