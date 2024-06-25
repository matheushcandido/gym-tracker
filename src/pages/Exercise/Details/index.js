import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { database } from "../../../config/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./style";

export default function DetailsExercise({ navigation, route }) {
    const [nameEdit, setNameEdit] = useState(route.params.name);
    const idExercise = route.params.id;

    async function editExercise(name, id) {
        try {
            const exerciseDocRef = doc(database, "Exercises", id);
            await updateDoc(exerciseDocRef, {
                name: name
            });
            navigation.navigate("Exercises");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Nome</Text>
            <TextInput 
            style={styles.inputText}
            placeholder="Exemplo: Supino inclinado"
            onChangeText={setNameEdit}
            value={nameEdit}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={() => {editExercise(nameEdit, idExercise)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}