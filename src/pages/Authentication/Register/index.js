import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../../config/firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './style';

export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Account created successfully');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={register}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}