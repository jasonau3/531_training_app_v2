import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import {
    doc,
    addDoc,
    getDocs,
    updateDoc,
    collection,
} from 'firebase/firestore';

import PrimaryButton from './PrimaryButton.jsx';
import ExerciseForm from './ExerciseForm.jsx';

const WorkoutEditorFormComponent = ({
    isWideScreen,
    setModalOpen,
    currentWorkout,
    programRef,
}) => {
    // State for exercise details
    const [week, setWeek] = useState(0);
    const [day, setDay] = useState(0);
    const [mainExercise, setMainExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [percentage, setPercentage] = useState('');
    const [mainSets, setMainSets] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [accessoryExercise, setAccessoryExercise] = useState('');
    const [accessoryReps, setAccessoryReps] = useState('');

    const workoutCollectionsRef = collection(programRef, 'workouts');

    // Set initial values for states if currentWorkout has data
    useEffect(() => {
        if (currentWorkout) {
            setWeek(currentWorkout.week);
            setDay(currentWorkout.day);
            setMainSets(currentWorkout.mainSets);
            setAccessories(currentWorkout.accessories);
        }
    }, [currentWorkout]);

    const handleSaveWorkout = async () => {
        // if no current id, then its an existing record
        if (currentWorkout?.id) {
            try {
                const updatedWorkout = {
                    name: `${week}-${day}-${mainExercise}`,
                    week: parseInt(week),
                    day: parseInt(day),
                    mainSets: mainSets,
                    accessories: accessories,
                };

                const workoutDocRef = doc(
                    workoutCollectionsRef,
                    currentWorkout.id
                );

                // Update the specific workout document with the new data
                await updateDoc(workoutDocRef, updatedWorkout);

                setModalOpen(false);
            } catch (error) {
                console.error('Error updating workout');
            }
        }
        // if no current id, then its a new record
        else if (currentWorkout === null) {
            try {
                const newWorkout = {
                    name: `${week}-${day}-${mainExercise}`,
                    week: parseInt(week),
                    day: parseInt(day),
                    mainSets: mainSets,
                    accessories: accessories,
                };

                await addDoc(workoutCollectionsRef, newWorkout);

                setModalOpen(false);
            } catch (error) {
                console.error('Error adding new workout:', error);
            }
        }
    };

    const handleEditMainSet = (index, field, newValue) => {
        const updatedMainSets = [...mainSets];
        updatedMainSets[index][field] = newValue;
        setMainSets(updatedMainSets);
    };

    const handleDeleteMainSet = (index) => {
        const updatedMainSets = [...mainSets];
        updatedMainSets.splice(index, 1);
        setMainSets(updatedMainSets);
    };

    const handleAddMainSet = () => {
        if (
            sets.trim() !== '' &&
            reps.trim() !== '' &&
            percentage.trim() !== ''
        ) {
            const newMainSet = {
                name: mainExercise,
                sets: sets,
                reps: reps,
                percentage: percentage,
            };
            setMainSets([...mainSets, newMainSet]);

            // Reset input fields
            setMainExercise('');
            setSets('');
            setReps('');
            setPercentage('');
        }
    };
    console.log(mainSets);
    const handleAddAccessorySet = () => {
        if (accessoryExercise.trim() !== '' && accessoryReps.trim() !== '') {
            const newAccessory = {
                exercise: accessoryExercise,
                reps: accessoryReps,
            };
            setAccessories([...accessories, newAccessory]);

            // Reset input fields
            setAccessoryExercise('');
            setAccessoryReps('');
        }
    };

    const handleEditAccessoryExercise = (index, newExercise) => {
        const updatedAccessories = [...accessories];
        updatedAccessories[index].exercise = newExercise;
        setAccessories(updatedAccessories);
    };

    const handleEditAccessoryReps = (index, newReps) => {
        const updatedAccessories = [...accessories];
        updatedAccessories[index].reps = newReps;
        setAccessories(updatedAccessories);
    };

    const handleDeleteAccessory = (index) => {
        const updatedAccessories = [...accessories];
        updatedAccessories.splice(index, 1);
        setAccessories(updatedAccessories);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <MaterialIcons
                        name='close'
                        size={24}
                        onPress={() => setModalOpen(false)}
                        style={styles.modalClose}
                    />

                    <Text style={styles.subtitle}>Add Workout Day</Text>

                    <View
                        style={
                            isWideScreen
                                ? styles.rowContainer
                                : styles.columnContainer
                        }
                    >
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            placeholder='Week'
                            value={week}
                            onChangeText={setWeek}
                            keyboardType='numeric'
                        />
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            placeholder='Day'
                            value={day}
                            onChangeText={setDay}
                            keyboardType='numeric'
                        />
                    </View>

                    <Text style={styles.subtitle}>Main Sets</Text>
                    {mainSets.map((set, index) => (
                        <View
                            key={index}
                            style={[
                                isWideScreen
                                    ? styles.editableSetRowContainer
                                    : styles.editableSetColumnContainer,
                            ]}
                        >
                            <View style={styles.accessoryInfoContainer}>
                                <Text style={styles.setNumberLabel}>
                                    Set #{index + 1}
                                </Text>
                                <MaterialIcons
                                    name='delete'
                                    size={20}
                                    color='#333'
                                    onPress={() => handleDeleteMainSet(index)}
                                    style={styles.deleteIcon}
                                />
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder='Main Exercise Name'
                                value={set.name}
                                onChangeText={(newName) =>
                                    handleEditMainSet(index, 'name', newName)
                                }
                            />

                            <TextInput
                                style={styles.input}
                                placeholder='Sets'
                                value={set.sets.toString()}
                                onChangeText={(newSets) =>
                                    handleEditMainSet(index, 'sets', newSets)
                                }
                                keyboardType='numeric'
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Reps'
                                value={set.reps}
                                onChangeText={(newReps) =>
                                    handleEditMainSet(index, 'reps', newReps)
                                }
                                keyboardType='string'
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Percentage'
                                value={set.percentage.toString()}
                                onChangeText={(newPercentage) =>
                                    handleEditMainSet(
                                        index,
                                        'percentage',
                                        newPercentage
                                    )
                                }
                                keyboardType='numeric'
                            />
                        </View>
                    ))}

                    <View
                        style={
                            isWideScreen
                                ? styles.rowContainer
                                : styles.columnContainer
                        }
                    >
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder='Name'
                            value={mainExercise}
                            onChangeText={setMainExercise}
                            keyboardType='string'
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder='Sets'
                            value={sets}
                            onChangeText={setSets}
                            keyboardType='numeric'
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder='Reps'
                            value={reps}
                            onChangeText={setReps}
                            keyboardType='string'
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder='Percentage %'
                            value={percentage}
                            onChangeText={setPercentage}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title='Add a main set'
                            onPress={handleAddMainSet}
                            style={styles.smallButton}
                        />
                    </View>

                    <Text style={styles.subtitle}>Accessories</Text>

                    {accessories.map((accessory, index) => (
                        <View
                            key={index}
                            style={[
                                isWideScreen
                                    ? styles.editableSetRowContainer
                                    : styles.editableSetColumnContainer,
                            ]}
                        >
                            <View style={styles.accessoryInfoContainer}>
                                <Text style={styles.setNumberLabel}>
                                    Accessory #{index + 1}
                                </Text>
                                <MaterialIcons
                                    name='delete'
                                    size={20}
                                    color='#333'
                                    onPress={() => handleDeleteAccessory(index)}
                                    style={styles.deleteIcon}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder='Name'
                                value={accessory.exercise}
                                onChangeText={(newExercise) =>
                                    handleEditAccessoryExercise(
                                        index,
                                        newExercise
                                    )
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Reps'
                                value={accessory.reps.toString()}
                                onChangeText={(newReps) =>
                                    handleEditAccessoryReps(index, newReps)
                                }
                                keyboardType='numeric'
                            />
                        </View>
                    ))}

                    <View
                        style={
                            isWideScreen
                                ? styles.rowContainer
                                : styles.columnContainer
                        }
                    >
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder='Accessory exercise'
                            value={accessoryExercise}
                            onChangeText={setAccessoryExercise}
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder='Accessory reps'
                            value={accessoryReps}
                            onChangeText={setAccessoryReps}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title='Add an accessory set'
                            onPress={handleAddAccessorySet}
                            style={styles.smallButton}
                        />
                    </View>

                    <PrimaryButton
                        label='Save Workout'
                        onPress={handleSaveWorkout}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default WorkoutEditorFormComponent;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
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
        paddingHorizontal: 60,
        marginVertical: 100,
        width: '70%',
    },
    modalClose: {
        alignSelf: 'flex-start',
        color: 'gray',
        marginVertical: 10,
        marginLeft: -50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        marginRight: 10,
        borderRadius: 5,
        width: '25%',
    },
    smallInput: {
        flex: 0.3,
        alignSelf: 'stretch',
    },
    largeInput: {
        flex: 1,
        alignSelf: 'stretch',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    columnContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    buttonContainer: {
        marginBottom: 10,
        alignContent: 'center',
        justifyContent: 'center',
    },
    editableSetRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    editableSetColumnContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    accessoryInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    setNumberLabel: {
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteIcon: {
        marginLeft: 'auto', // Push the delete icon to the right
        marginRight: 10,
    },
});
