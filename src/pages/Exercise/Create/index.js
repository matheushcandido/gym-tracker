import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../../config/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import styles from "../Create/style";

export default function CreateExercise({ navigation }) {
    const [name, setName] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData !== null) {
                    const user = JSON.parse(userData);
                    setUserId(user.uid);
                }
            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

        fetchUserId();
    }, []);

    async function addExercise() {
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        try {
            await addDoc(collection(database, "Exercises"), {
                name: name,
                userId: userId
            });
            navigation.navigate("ExerciseList");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome</Text>
            <TextInput 
                style={styles.inputText}
                placeholder="Exemplo: Supino inclinado"
                onChangeText={setName}
                value={name}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={addExercise}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}
