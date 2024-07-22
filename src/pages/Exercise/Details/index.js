import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { database } from "../../../config/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./style";
import { Picker } from "@react-native-picker/picker";

export default function DetailsExercise({ navigation, route }) {
    const [nameEdit, setNameEdit] = useState(route.params.name);
    const [categoryEdit, setCategoryEdit] = useState(route.params.category);
    const idExercise = route.params.id;

    async function editExercise(name, id, category) {
        try {
            const exerciseDocRef = doc(database, "Exercises", id);
            await updateDoc(exerciseDocRef, {
                name: name,
                category: category
            });
            navigation.navigate("ExerciseList");
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

            <Text style={styles.label}>Categoria</Text>
            <Picker
                selectedValue={categoryEdit}
                style={styles.inputText}
                onValueChange={(itemValue) => setCategoryEdit(itemValue)}
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

            <TouchableOpacity style={styles.buttonNew} onPress={() => {editExercise(nameEdit, idExercise, categoryEdit)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}