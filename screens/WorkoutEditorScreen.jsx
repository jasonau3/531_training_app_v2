import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    Modal,
    TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import { auth, db } from '../firebase';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';

import WorkoutDayCard from '../components/WorkoutDayCard';
import WorkoutEditorFormComponent from '../components/WorkoutEditorFormComponent';

import {
    BACKGROUND_APP_COLOR,
    sortByName,
    calculateHorizontalPadding,
} from '../Helpers.js';
import PrimaryButton from '../components/PrimaryButton';

const WorkoutEditorScreen = ({ route }) => {
    const { program } = route.params;

    const myProgramId = program.id;

    const [modalOpen, setModalOpen] = useState(false);
    const [trainingMax, setTrainingMax] = useState(0);
    const [programWeeks, setProgramWeeks] = useState(0);
    const [programName, setprogramName] = useState('');
    const [myWorkouts, setMyWorkouts] = useState([]);
    const [currentWorkout, setCurrentWorkout] = useState([]);

    const isWideScreen = Dimensions.get('window').width >= 700;
    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    const programSnapshot = doc(db, 'programs', myProgramId);
    const workoutCollectionsRef = collection(programSnapshot, 'workouts');

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const querySnapshot = await getDocs(workoutCollectionsRef);
                const workoutsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log(workoutsData);

                const extractedWorkouts = Object.values(workoutsData);
                const validWorkouts = extractedWorkouts.filter(
                    (item) => typeof item === 'object'
                );

                const sortedWorkouts = sortByName(validWorkouts);
                setMyWorkouts(sortedWorkouts);
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };

        fetchWorkouts();
        setTrainingMax(program.trainingMax);
        setProgramWeeks(program.programWeeks);
        setprogramName(program.name);
    }, [modalOpen]);

    const setUserProgram = async (programName) => {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, { program_id: programName }, { merge: true });
    };

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <View>
                <Text style={styles.title}>Program Name: {programName}</Text>

                <PrimaryButton
                    label='Set as current program'
                    onPress={() => setUserProgram(myProgramId)}
                />

                <View style={styles.rowContainer}>
                    <Text style={styles.subtitle}>Training Max %</Text>
                    <TextInput
                        style={[styles.input, styles.smallInput]}
                        placeholder='Training Max %'
                        value={trainingMax}
                        onChangeText={setTrainingMax}
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.subtitle}>Program week length</Text>
                    <TextInput
                        style={[styles.input, styles.smallInput]}
                        placeholder='Program week length'
                        value={program.programWeeks}
                        onChangeText={setProgramWeeks}
                        keyboardType='numeric'
                    />
                </View>
            </View>

            <FlatList
                data={myWorkouts}
                renderItem={({ item }) => (
                    <>
                        <WorkoutDayCard
                            label={`Week ${item.week} - Day ${item.day}`}
                            onPress={() => {
                                setModalOpen(true);
                                setCurrentWorkout(item);
                            }}
                        />
                    </>
                )}
                keyExtractor={(item) => item.name}
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
                <WorkoutEditorFormComponent
                    isWideScreen={isWideScreen}
                    setModalOpen={setModalOpen}
                    currentWorkout={currentWorkout}
                    programRef={programSnapshot}
                />
            </Modal>
        </View>
    );
};

export default WorkoutEditorScreen;

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
        marginRight: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    smallInput: {
        flex: 0.3,
        alignSelf: 'stretch',
    },
});
