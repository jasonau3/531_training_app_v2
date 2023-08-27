import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { auth, db } from '../firebase';
import { getDocs, collection, doc } from 'firebase/firestore';

import UpdatePRComponent from '../components/UpdatePRComponent';
import WeekButton from '../components/WeekButton';
import WorkoutDayCard from '../components/WorkoutDayCard';

import { BACKGROUND_APP_COLOR } from '../Color.js';
import PrimaryButton from '../components/PrimaryButton';

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
    const workoutsCollectionRef = collection(db, 'workouts');

    // Fetch data only when the component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
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

                const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                const workoutsData = workoutsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMyWorkout(workoutsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, []);

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
                    onPress={() => console.log('Week 2')}
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
                            workout: myWorkout,
                        })
                    }
                />
            </View>
            <UpdatePRComponent
                personalRecords={personalRecords}
                setPersonalRecords={setPersonalRecords}
            />
            <PrimaryButton
                onPress={() => navigation.navigate('Program_editor')}
                label={'Program Editor'}
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
