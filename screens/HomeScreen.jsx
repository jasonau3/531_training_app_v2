import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { auth, db } from '../firebase';
import {
    getDocs,
    getDoc,
    collection,
    doc,
    query,
    orderBy,
    limit,
} from 'firebase/firestore';

import JournalTabScreen from './JournalTabScreen.jsx';
import ProgramTabScreen from './ProgramTabScreen.jsx';
import WorkoutScreen from './WorkoutScreen.jsx';

import HeaderComponent from '../components/HeaderComponent';
import UpdatePRComponent from '../components/UpdatePRComponent';
import WeekButton from '../components/WeekButton';
import WorkoutDayCard from '../components/WorkoutDayCard';
import {
    BACKGROUND_APP_COLOR,
    sortByName,
    getRecentWorkoutWeek,
    calculateHorizontalPadding,
} from '../Helpers.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeContent = () => {
    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    const [personalRecords, setPersonalRecords] = useState(null);
    const [myWorkouts, setMyWorkouts] = useState(null);
    const [myProgram, setMyProgram] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(1);

    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
    const personalRecordsCollectionRef = collection(
        userDocRef,
        'personal_records'
    );
    const workoutHistoryCollectionRef = collection(
        userDocRef,
        'workout_history'
    );

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // Fetch data only when the component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // get personal records data
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

                // get workout data
                const userDocSnapshot = await getDoc(userDocRef);
                const userProgramId = userDocSnapshot.data().program_id;

                const programCollectionRef = collection(db, 'programs');
                const programDocRef = doc(programCollectionRef, userProgramId);
                const programDocSnapshot = await getDoc(programDocRef);
                const programData = {
                    id: programDocSnapshot.id,
                    ...programDocSnapshot.data(),
                };
                setMyProgram(programData);

                const workoutsCollectionRef = collection(
                    programDocRef,
                    'workouts'
                );
                const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                const workoutsData = workoutsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const sortedData = sortByName(workoutsData);
                setMyWorkouts(sortedData);

                // get most recent workout and set the current week to that week
                const recentWorkoutQuery = query(
                    workoutHistoryCollectionRef,
                    orderBy('startTime', 'desc'),
                    limit(1)
                );
                const querySnapshot = await getDocs(recentWorkoutQuery);

                if (!querySnapshot.empty) {
                    const latestWorkout = querySnapshot.docs[0].data();
                    const titleParts = latestWorkout.title.split(' - ');
                    const result = getRecentWorkoutWeek(
                        parseInt(titleParts[1]),
                        parseInt(titleParts[2])
                    );
                    setCurrentWeek(result);
                } else {
                    setCurrentWeek(1); // default to week 1 if no workouts have been done yet
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, [isFocused]);

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            <ScrollView>
                <View style={styles.week_btns}>
                    <ScrollView horizontal={true}>
                        {Array.from(
                            { length: myProgram?.programWeeks || 0 },
                            (_, index) => {
                                const week = index + 1;
                                return (
                                    <WeekButton
                                        label={`Week ${week}`}
                                        onPress={() => setCurrentWeek(week)}
                                        isCompleted={currentWeek === week}
                                        key={week}
                                    />
                                );
                            }
                        )}
                    </ScrollView>
                </View>

                <View style={styles.day_btns}>
                    {myWorkouts &&
                        myWorkouts
                            .filter((workout) => workout.week === currentWeek)
                            .map((workout) => {
                                return (
                                    <WorkoutDayCard
                                        label={`Day ${workout.day}`}
                                        onPress={() =>
                                            navigation.push('Workout', {
                                                week: workout.week,
                                                day: workout.day,
                                                personalRecords:
                                                    personalRecords,
                                                workout: workout,
                                                trainingMax:
                                                    myProgram.trainingMax,
                                            })
                                        }
                                        key={workout.id}
                                    />
                                );
                            })}
                </View>
                <UpdatePRComponent
                    personalRecords={personalRecords}
                    setPersonalRecords={setPersonalRecords}
                />
            </ScrollView>
        </View>
    );
};

const HomeTab = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Home Content'
                component={HomeContent}
                options={{ header: () => <HeaderComponent /> }}
            />
            <Stack.Screen
                name='Workout'
                component={WorkoutScreen}
                options={{
                    header: () => <HeaderComponent showBackBtn={true} />,
                }}
            />
        </Stack.Navigator>
    );
};

const TabScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'red',
                tabStyle: {
                    fontWeight: 'bold',
                },
                labelStyle: {
                    fontSize: 16,
                },
            }}
        >
            <Tab.Screen
                name='Home'
                component={HomeTab}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='home' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                }}
            />
            <Tab.Screen
                name='Program'
                component={ProgramTabScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Program',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name='dumbbell' color={color} size={18} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                }}
            />
            <Tab.Screen
                name='Journal'
                component={JournalTabScreen}
                options={{
                    header: () => <HeaderComponent />,
                    tabBarLabel: 'Journal',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='book' color={color} size={size} />
                    ),
                    tabBarLabelPosition: 'below-icon',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_APP_COLOR,
        paddingVertical: 20,
    },
    week_btns: {
        flex: 0.2,
        flexDirection: 'row',
    },
    day_btns: {
        flex: 1,
    },
});
