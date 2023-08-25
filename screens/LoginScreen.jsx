import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { addDoc, collection, doc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';

import { PRIMARY_COLOR } from '../Color.js';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const users = collection(db, 'users');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate('Home');
            }
        });

        return unsubscribe;
    }, []);

    const handleLogin = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
        } catch (error) {
            console.error('Error during login:', error);
            alert('Error during login. Check your email and password.');
        }
    };

    const handleSignUp = async () => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredentials.user;
            console.log('Registered with:', user.email);

            // need to add user to database
            try {
                await addDoc(users, {
                    email: user.email,
                    uid: user.uid,
                });

                // Get references to the subcollections
                const userDocRef = doc(users, user.uid);
                const workoutsCollectionRef = collection(
                    userDocRef,
                    'workouts'
                );
                const personalRecordsCollectionRef = collection(
                    userDocRef,
                    'personal_records'
                );

                // Add initial workout and personal records documents to subcollections
                await addDoc(workoutsCollectionRef, {
                    title: 'My First Workout',
                    date: new Date(),
                });

                await addDoc(personalRecordsCollectionRef, {
                    press: 0,
                    squat: 0,
                    deadlift: 0,
                    bench: 0,
                });

                console.log('Subcollections created');
            } catch (error) {
                console.error('Error adding user to database: ', error);
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('That email address is already in use!');
            } else {
                // Handle other errors
                console.error('Error during sign up:', error);
                alert(
                    'Error during sign up. Make sure that your password is at least 6 characters long.'
                );
            }
        }
    };

    const handleGoogleLogin = async () => {
        // TODO: https://youtu.be/XB_gNDoOhjY?t=972
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error during Google login:', error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={handleGoogleLogin}
                    style={[styles.button, styles.buttonOther]}
                >
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/color/48/000000/google-logo.png',
                        }}
                    />
                    <Text style={styles.buttonOtherText}>
                        Continue with Google
                    </Text>
                </Pressable>
                <Pressable onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '70%',
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        width: '50%',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: PRIMARY_COLOR,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonOutline: {
        backgroundColor: '#fff',
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
    },
    buttonOther: {
        backgroundColor: '#fff',
        borderColor: '#CBCBCB',
        borderWidth: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: PRIMARY_COLOR,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOtherText: {
        color: '#505050',
        fontWeight: '700',
        fontSize: 16,
    },
});
