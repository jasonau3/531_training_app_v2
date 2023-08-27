import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { collection, addDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { BACKGROUND_APP_COLOR } from '../Color.js';
import ExerciseCard from '../components/ExerciseCard.jsx';
import PrimaryButton from '../components/PrimaryButton';

const WorkoutScreen = ({ route }) => {
    const { week, day, personalRecords, workout } = route.params;

    const [startTime, setStartTime] = useState(null);

    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = screenWidth >= 600 ? 200 : 20;

    const myPR = personalRecords[0];
    const myWorkout = workout[0];

    const users = collection(db, 'users');
    const userDocRef = doc(users, auth.currentUser.uid);
    const workoutsCollectionRef = collection(userDocRef, 'workout_history');

    const navigation = useNavigation();

    // on load, set start time
    useEffect(() => {
        setStartTime(new Date());
    }, []);

    // on finish, upload data to firebase workout history
    const handleWorkoutFinish = async () => {
        const currentTime = new Date();

        try {
            await addDoc(workoutsCollectionRef, {
                title: myWorkout.mainExercise + ' - ' + week + ' - ' + day,
                start: startTime,
                endTime: currentTime,
            });
            console.log('Workout added to history');
            navigation.goBack();
        } catch {
            console.error('Error adding workout to history');
        }
    };

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <Text style={styles.subtitle}>
                {week} - {day}
            </Text>
            <Text style={styles.workout_heading}>Main Set</Text>
            {workout[0].mainSets.map((curSet, index) => (
                <ExerciseCard
                    key={index}
                    name={myWorkout.mainExercise}
                    isMainSet={true}
                    sets={curSet.sets}
                    reps={curSet.reps}
                    weight={
                        Math.round(
                            ((curSet.percentage / 100) *
                                (myPR[myWorkout.mainExercise] * 0.9)) /
                                1.25
                        ) * 1.25
                    } // rounds to the nearest 1.25lb
                />
            ))}
            <Text style={styles.workout_heading}>Accessories</Text>
            {workout[0].accessories.map((curSet, index) => (
                <ExerciseCard
                    key={index}
                    name={curSet.exercise}
                    isMainSet={false}
                    sets={null}
                    reps={curSet.reps}
                    weight={null}
                />
            ))}

            <PrimaryButton onPress={handleWorkoutFinish} label={'Finish'} />
        </View>
    );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: BACKGROUND_APP_COLOR,
        flex: 1,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    workout_heading: {
        fontSize: 20,
        marginVertical: 10,
    },
});
