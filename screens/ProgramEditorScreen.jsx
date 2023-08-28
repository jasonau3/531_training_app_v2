import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

import {
    BACKGROUND_APP_COLOR,
    sortByName,
    calculateHorizontalPadding,
} from '../Helpers.js';
import WorkoutDayCard from '../components/WorkoutDayCard';
import ProgramEditorFormComponent from '../components/ProgramEditorFormComponent';
import PrimaryButton from '../components/PrimaryButton';

const ProgramEditorScreen = () => {
    // State for all saved workouts
    const [workouts, setWorkouts] = useState([]);
    const [currentWorkout, setCurrentWorkout] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const workoutsCollectionRef = collection(db, 'workouts');

    const isWideScreen = Dimensions.get('window').width >= 700;
    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                const workoutsData = workoutsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const sortedData = sortByName(workoutsData);
                setWorkouts(sortedData);
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };

        fetchWorkouts();
    }, [modalOpen]);

    console.log(workouts);

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <Text style={styles.title}>5/3/1 Program Editor</Text>

            <FlatList
                data={workouts}
                renderItem={({ item }) => (
                    <>
                        <WorkoutDayCard
                            label={`Week ${item.week} - day ${item.day} - ${item.mainExercise}`}
                            onPress={() => {
                                setModalOpen(true);
                                setCurrentWorkout(item);
                            }}
                        />
                    </>
                )}
                keyExtractor={(item) => item.id}
            />
            <PrimaryButton
                label='Add new workout'
                onPress={() => {
                    setModalOpen(true);
                    setCurrentWorkout(null);
                }}
            />

            <Modal
                visible={modalOpen}
                animationType='fade'
                animationConfig={{ duration: 100 }}
                transparent={true}
            >
                <ProgramEditorFormComponent
                    isWideScreen={isWideScreen}
                    setModalOpen={setModalOpen}
                    currentWorkout={currentWorkout}
                    workoutsCollectionRef={workoutsCollectionRef}
                    documentRef={currentWorkout?.id}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: BACKGROUND_APP_COLOR,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default ProgramEditorScreen;
