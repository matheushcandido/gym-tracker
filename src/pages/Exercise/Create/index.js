import React from "react";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { database } from "../../../config/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import styles from "../Create/style";

export default function CreateExercise({ navigation }){

    const [name, setName] = useState(null);

    async function addExercise() {
        try {
            await addDoc(collection(database, "Exercises"), {
                name: name
            });
            navigation.navigate("Exercises");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Nome</Text>
            <TextInput 
            style={styles.inputText}
            placeholder="Exemplo: Supino inclinado"
            onChangeText={setName}
            value={name}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={() => {addExercise()}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}