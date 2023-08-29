import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Pressable,
    Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { collection, addDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import {
    BACKGROUND_APP_COLOR,
    calculateHorizontalPadding,
} from '../Helpers.js';
import ExerciseCard from '../components/ExerciseCard.jsx';
import PrimaryButton from '../components/PrimaryButton';
import ExerciseForm from '../components/ExerciseForm';

const WorkoutScreen = ({ route }) => {
    const { week, day, personalRecords, workout } = route.params;
    const [modalOpen, setModalOpen] = useState(false);

    const [startTime, setStartTime] = useState(null);

    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    const myPR = personalRecords[0];

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
                title: workout.mainExercise + ' - ' + week + ' - ' + day,
                startTime: startTime,
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
                Week {week} - day {day}
            </Text>
            <Text style={styles.workout_heading}>Main Set</Text>
            {workout.mainSets.map((curSet, index) => (
                <ExerciseCard
                    key={index}
                    name={workout.mainExercise}
                    isMainSet={true}
                    sets={curSet.sets}
                    reps={curSet.reps}
                    weight={
                        Math.round(
                            ((curSet.percentage / 100) *
                                (myPR[workout.mainExercise] * 0.9)) /
                                1.25
                        ) * 1.25
                    } // rounds to the nearest 1.25lb
                    setModalOpen={setModalOpen}
                />
            ))}
            <Text style={styles.workout_heading}>Accessories</Text>
            {workout.accessories.map((curSet, index) => (
                <ExerciseCard
                    key={index}
                    name={curSet.exercise}
                    isMainSet={false}
                    sets={null}
                    reps={curSet.reps}
                    weight={null}
                    setModalOpen={setModalOpen}
                />
            ))}

            <Modal
                visible={modalOpen}
                animationType='slide'
                animationConfig={{ duration: 100 }}
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <MaterialIcons
                            name='close'
                            size={24}
                            onPress={() => setModalOpen(false)}
                            style={styles.modalClose}
                        />

                        <ExerciseForm />

                        <PrimaryButton
                            label='Save exercise'
                            onPress={() => setModalOpen(false)}
                        />
                    </View>
                </View>
            </Modal>

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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalBox: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalClose: {
        alignSelf: 'flex-start',
        color: 'gray',
    },
    modalText: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});
