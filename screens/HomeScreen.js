import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { auth, db } from '../firebase';
import { getDocs, collection, doc } from 'firebase/firestore';

import UpdatePRComponent from '../components/UpdatePRComponent';

const HomeScreen = () => {
    const [personalRecords, setPersonalRecords] = useState(null);

    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
    const personalRecordsCollectionRef = collection(
        userDocRef,
        'personal_records'
    );

    useEffect(() => {
        const fetchPersonalRecords = async () => {
            try {
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
            } catch (error) {
                console.error('Error fetching personal records:', error);
            }
        };

        fetchPersonalRecords();
    }, []);

    const navigation = useNavigation();

    const handleSignOut = async () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text>{auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
                style={[styles.button, styles.buttonOther]}
            >
                <Text style={styles.buttonOtherText}>Sign out</Text>
            </TouchableOpacity>

            <UpdatePRComponent
                personalRecords={personalRecords}
                setPersonalRecords={setPersonalRecords}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 25,
    },
});
