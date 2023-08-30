import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    Pressable,
    Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { auth } from '../firebase';

import {
    PRIMARY_COLOR,
    BACKGROUND_APP_COLOR,
    calculateHorizontalPadding,
} from '../Helpers.js';

const HeaderComponent = ({ showBackBtn }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const paddingHorizontal = calculateHorizontalPadding(
        Dimensions.get('window').width
    );

    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSignOut = async () => {
        auth.signOut()
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={[styles.container, { paddingHorizontal }]}>
            {showBackBtn ? (
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <MaterialIcons name='arrow-back' size={24} color='black' />
                </Pressable>
            ) : null}

            <Text style={styles.heading}>5/3/1 Training</Text>
            <Pressable
                style={styles.profileButton}
                onPress={() => setModalOpen(true)}
            >
                <Image
                    source={require('../assets/profile.png')}
                    style={styles.profileIcon}
                />
            </Pressable>

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

                        <Text style={styles.modalText}>
                            {auth.currentUser?.email}
                        </Text>
                        <Pressable
                            onPress={handleSignOut}
                            style={styles.buttonSignOut}
                        >
                            <Text style={styles.buttonSignOutText}>
                                Sign out
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default HeaderComponent;

const styles = StyleSheet.create({
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BACKGROUND_APP_COLOR,
        paddingTop: 30,
    },
    profileButton: {
        marginLeft: 'auto',
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 50,
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
    buttonSignOut: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'blue',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: PRIMARY_COLOR,
    },
    buttonSignOutText: {
        color: 'white',
        fontWeight: 'bold',
    },
    backButton: {
        marginRight: 10,
    },
});
