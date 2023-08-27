import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    FlatList,
    Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { db } from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

import { BACKGROUND_APP_COLOR } from '../Color.js';
import WorkoutDayCard from '../components/WorkoutDayCard';

const ProgramEditorScreen = () => {
    // State for all saved workouts
    const [workouts, setWorkouts] = useState([]);

    // State for exercise details
    const [week, setWeek] = useState('');
    const [day, setDay] = useState('');
    const [mainExercise, setMainExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [percentage, setPercentage] = useState('');

    const workoutsCollectionRef = collection(db, 'workouts');

    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = screenWidth >= 600 ? 200 : 20;

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                const workoutsData = workoutsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setWorkouts(workoutsData);
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };

        fetchWorkouts();
    }, []);

    const handleAddWorkout = async () => {
        if (mainExercise.trim() !== '') {
            try {
                const newWorkout = {
                    id: 'test',
                    week: 2,
                    day: 1,
                    mainExercise: mainExercise,
                    mainSets: mainSets,
                    accessories: accessories,
                };

                // Add the new workout object to the Firestore collection
                await addDoc(workoutsCollectionRef, newWorkout);

                // TODO: Reset input fields
            } catch (error) {
                console.error('Error adding workout:', error);
            }
        }
    };

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <Text style={styles.title}>5/3/1 Program Editor</Text>

            <TextInput
                style={styles.input}
                placeholder='Week'
                value={week}
                onChangeText={setWeek}
                keyboardType='numeric'
            />
            <TextInput
                style={styles.input}
                placeholder='Day'
                value={day}
                onChangeText={setDay}
                keyboardType='numeric'
            />

            <Text>Main set</Text>
            <TextInput
                style={styles.input}
                placeholder='Main Exercise'
                value={mainExercise}
                onChangeText={setMainExercise}
            />

            <Text>First set</Text>

            <TextInput
                style={styles.input}
                placeholder='Sets'
                value={sets}
                onChangeText={setSets}
                keyboardType='numeric'
            />
            <TextInput
                style={styles.input}
                placeholder='Reps'
                value={reps}
                onChangeText={setReps}
                keyboardType='numeric'
            />
            <TextInput
                style={styles.input}
                placeholder='Percentage'
                value={percentage}
                onChangeText={setPercentage}
                keyboardType='numeric'
            />

            <Text>Accessories</Text>
            <TextInput
                style={styles.input}
                placeholder='First accessory name'
                value={percentage}
                onChangeText={setPercentage}
                keyboardType='numeric'
            />
            <TextInput
                style={styles.input}
                placeholder='First accessory reps'
                value={percentage}
                onChangeText={setPercentage}
                keyboardType='numeric'
            />

            <Button title='Add Workout' onPress={handleAddWorkout} />
            <FlatList
                data={workouts}
                renderItem={({ item }) => (
                    <>
                        <WorkoutDayCard
                            label={`Week ${item.week} - day ${item.day} - ${item.mainExercise}`}
                            onPress={() => console.log('TODO EDIT WORKOUT')}
                        />
                        <MaterialIcons name='edit' size={20} color='#333' />
                    </>
                )}
                keyExtractor={(item) => item.id}
            />
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
});

export default ProgramEditorScreen;
