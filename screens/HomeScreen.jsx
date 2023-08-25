import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { auth, db } from '../firebase';
import { getDocs, collection, doc, onSnapshot } from 'firebase/firestore';

import UpdatePRComponent from '../components/UpdatePRComponent';
import WeekButton from '../components/WeekButton';
import WorkoutDayCard from '../components/WorkoutDayCard';

import { PRIMARY_COLOR, BACKGROUND_APP_COLOR } from '../Color.js';

import { local_workout } from '../Workout.js';

const HomeScreen = () => {
    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = screenWidth >= 600 ? 200 : 20;

    const [personalRecords, setPersonalRecords] = useState(null);
    const [myWorkout, setMyWorkout] = useState(null);

    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
    const personalRecordsCollectionRef = collection(
        userDocRef,
        'personal_records'
    );

    // TODO: GET WORKOUT FROM FIREBASE
    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const workoutData = local_workout;
                setMyWorkout(workoutData);
            } catch (error) {
                console.error('Error fetching workout:', error);
            }
        };

        fetchWorkout();
    }, []);

    useFocusEffect(() => {
        const unsubscribePersonalRecords = onSnapshot(
            personalRecordsCollectionRef,
            (snapshot) => {
                const personalRecordsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPersonalRecords(personalRecordsData);
            }
        );

        return () => {
            // Unsubscribe the personalRecords listener
            unsubscribePersonalRecords();
        };
    });

    console.log(myWorkout);

    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <View style={styles.week_btns}>
                <WeekButton
                    label={'Week 1'}
                    onPress={() => console.log('Week 1')}
                    isCompleted={true}
                />
                <WeekButton
                    label={'Week 2'}
                    onPress={() => console.log('Week 1')}
                    completed={false}
                />
            </View>
            <View>
                <WorkoutDayCard
                    label={'Day 1 - Press'}
                    onPress={() =>
                        navigation.push('Workout', {
                            week: 'Week 1',
                            day: 'Day 1',
                            personalRecords: personalRecords,
                        })
                    }
                />
                <WorkoutDayCard
                    label={'Day 2 - Squat'}
                    onPress={() =>
                        navigation.push('Workout', {
                            week: 'Week 1',
                            day: 'Day 2',
                            personalRecords: personalRecords,
                        })
                    }
                />
            </View>
            <UpdatePRComponent
                personalRecords={personalRecords}
                setPersonalRecords={setPersonalRecords}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_APP_COLOR,
        paddingVertical: 10,
    },
    week_btns: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    day_btns: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});
