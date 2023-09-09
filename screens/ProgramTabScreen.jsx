import { StyleSheet, Text, View, Dimensions, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

import WorkoutEditorScreen from './WorkoutEditorScreen';
import {
    BACKGROUND_APP_COLOR,
    calculateHorizontalPadding,
} from '../Helpers.js';
import HeaderComponent from '../components/HeaderComponent';
import PrimaryButton from '../components/PrimaryButton';
import ProgramCard from '../components/ProgramCard';
import ProgramEditorFormComponent from '../components/ProgramEditorFormComponent';

const Stack = createNativeStackNavigator();

const ProgramEditorScreen = () => {
    const [programs, setPrograms] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const programCollectionsRef = collection(db, 'programs');

    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const programsSnapshot = await getDocs(programCollectionsRef);
                var programsData = programsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPrograms(programsData);
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };

        fetchPrograms();
    }, [modalOpen]);

    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <Text style={styles.title}>5/3/1 Program Editor</Text>
            <Text style={styles.subtitle}>Select a program</Text>

            <View style={styles.programContainer}>
                {programs &&
                    programs.map((program) => {
                        return (
                            <ProgramCard
                                name={program.name}
                                key={program.id}
                                onPress={() => {
                                    navigation.push('Workout Content', {
                                        program: program,
                                    });
                                }}
                            />
                        );
                    })}
            </View>

            <PrimaryButton
                label='Add new program'
                onPress={() => setModalOpen(true)}
            />

            <Modal
                visible={modalOpen}
                animationType='fade'
                animationConfig={{ duration: 100 }}
                transparent={true}
            >
                <ProgramEditorFormComponent setModalOpen={setModalOpen} />
            </Modal>
        </View>
    );
};

const ProgramTab = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Program Content'
                component={ProgramEditorScreen}
                options={{ header: () => <HeaderComponent /> }}
            />
            <Stack.Screen
                name='Workout Content'
                component={WorkoutEditorScreen}
                options={{
                    header: () => <HeaderComponent showBackBtn={true} />,
                }}
            />
        </Stack.Navigator>
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
    programContainer: {
        flexDirection: 'row',
        gap: 20,
    },
});

export default ProgramTab;
