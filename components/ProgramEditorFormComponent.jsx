import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

import PrimaryButton from './PrimaryButton.jsx';

const ProgramEditorFormComponent = ({ setModalOpen }) => {
    const isWideScreen = Dimensions.get('window').width >= 700;

    const [programName, setProgramName] = useState('');
    const [trainingMax, setTrainingMax] = useState('');

    const handleSaveProgram = async () => {
        const programRef = collection(db, 'programs');

        await addDoc(programRef, {
            name: programName,
            trainingMax: trainingMax,
        });

        setModalOpen(false);
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
                <MaterialIcons
                    name='close'
                    size={24}
                    onPress={() => setModalOpen(false)}
                    style={styles.modalClose}
                />

                <View
                    style={
                        isWideScreen
                            ? styles.rowContainer
                            : styles.columnContainer
                    }
                >
                    <TextInput
                        style={[styles.input, styles.largeInput]}
                        placeholder='Program Name'
                        value={programName}
                        onChangeText={setProgramName}
                        keyboardType='string'
                    />
                </View>

                <View
                    style={
                        isWideScreen
                            ? styles.rowContainer
                            : styles.columnContainer
                    }
                >
                    <TextInput
                        style={[styles.input, styles.smallInput]}
                        placeholder='Training Max %'
                        value={trainingMax}
                        onChangeText={setTrainingMax}
                        keyboardType='numeric'
                    />
                </View>

                <PrimaryButton
                    label='Save Program'
                    onPress={handleSaveProgram}
                />
            </View>
        </View>
    );
};

export default ProgramEditorFormComponent;

const styles = StyleSheet.create({
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
});
