import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../../config/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import styles from "./style";
import { format } from "date-fns";

export default function CreateWeight({ navigation }) {
    const [weight, setWeight] = useState(null);
    const [date, setDate] = useState(new Date());
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

    async function addWeight() {
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        try {
            await addDoc(collection(database, "Weights"), {
                weight: weight,
                date: date,
                userId: userId
            });
            navigation.navigate("WeightList");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Seu peso</Text>
            <TextInput 
                style={styles.inputText}
                placeholder="Exemplo: 80kgs"
                keyboardType="numeric"
                onChangeText={setWeight}
                value={weight}
            />

            <Text style={styles.label}>Data</Text>
                <TextInput
                    style={styles.inputText}
                    value={format(date, "dd-MM-yyyy")}
                    editable={false}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={addWeight}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}