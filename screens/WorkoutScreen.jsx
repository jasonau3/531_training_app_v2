import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';

import { PRIMARY_COLOR, BACKGROUND_APP_COLOR } from '../Color.js';
import ExerciseCard from '../components/ExerciseCard.jsx';

const WorkoutScreen = ({ route }) => {
    const { week, day, personalRecords, workout } = route.params;
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [finishTime, setFinishTime] = useState(null);

    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = screenWidth >= 600 ? 200 : 20;

    const myPR = personalRecords[0];
    const myWorkout = workout[0];

    const handlePressIn = () => {
        setIsButtonPressed(true);
    };

    const handlePressOut = () => {
        setIsButtonPressed(false);
    };

    const buttonStyles = [
        styles.finish_button,
        isButtonPressed && styles.finish_button_pressed,
    ];

    const handleComponentLoad = () => {
        setStartTime(Date.now());
    };

    useEffect(() => {
        if (finishTime !== null && startTime !== null) {
            console.log('Workout finished!');
            // Calculate and log the elapsed time
            const elapsedMilliseconds = finishTime - startTime;
            console.log('Elapsed time:', elapsedMilliseconds, 'ms');
        }
    }, [finishTime, startTime]);

    const handleWorkoutFinish = () => {
        if (startTime) {
            setFinishTime(Date.now());
        }
    };

    return (
        <View
            style={[styles.container, { paddingHorizontal }]}
            onLoad={handleComponentLoad}
        >
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

            <Pressable
                onPress={handleWorkoutFinish}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={buttonStyles}
            >
                <Text style={styles.finish_button_text}>Finish</Text>
            </Pressable>
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
    finish_button: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
    },
    finish_button_text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    finish_button_pressed: {
        backgroundColor: PRIMARY_COLOR + '80',
    },
});
