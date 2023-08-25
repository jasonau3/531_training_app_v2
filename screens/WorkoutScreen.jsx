import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { PRIMARY_COLOR, BACKGROUND_APP_COLOR } from '../Color.js';

const WorkoutScreen = ({ route }) => {
    const { week, day, personalRecords } = route.params;

    console.log(personalRecords);

    return (
        <View style={styles.container}>
            <Text>
                {week} - {day}
            </Text>
        </View>
    );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: BACKGROUND_APP_COLOR,
        flex: 1,
    },
});
