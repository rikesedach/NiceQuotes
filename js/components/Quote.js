import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Quote(props) {
    const { text, author } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.author}>&mdash; {author}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        paddingHorizontal: 20,
        backgroundColor: 'aliceblue',
        borderRadius: 4,
        elevation: 4,
        shadowOffset: { width: 0, height: 0.75, },
        shadowRadius: 1.5,
        shadowOpacity: 0.25,
    },
    text: {
        fontSize: 36,
        fontStyle: 'italic',
        marginBottom: 10,
        textAlign: 'center'

    },
    author: {
        fontSize: 20,
        textAlign: 'right'
    }
});

