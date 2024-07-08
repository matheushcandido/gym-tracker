import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../../config/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import styles from "../Create/style";
import { Picker } from "@react-native-picker/picker";

export default function CreateExercise({ navigation }) {
    const [name, setName] = useState(null);
    const [category, setCategory] = useState("peito");
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
                userId: userId,
                category: category
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

            <Text style={styles.label}>Categoria</Text>
            <Picker
                selectedValue={category}
                style={styles.inputText}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                <Picker.Item label="Peito" value="peito" />
                <Picker.Item label="Costas" value="costas" />
                <Picker.Item label="Pernas" value="pernas" />
                <Picker.Item label="Ombros" value="ombros" />
                <Picker.Item label="Bíceps" value="biceps" />
                <Picker.Item label="Tríceps" value="triceps" />
                <Picker.Item label="Abdômen" value="abdomen" />
                <Picker.Item label="Panturrilha" value="panturrilha" />
            </Picker>
            <TouchableOpacity style={styles.buttonNew} onPress={addExercise}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}
