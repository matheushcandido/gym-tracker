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
            Alert.alert('Sucesso', 'Conta criada com sucesso.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', error.message);
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
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Já tem uma conta? Clique aqui e faça login.</Text>
            </TouchableOpacity>
        </View>
    );
}