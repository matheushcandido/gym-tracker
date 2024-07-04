import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { database } from "../../../config/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";
import { format, parse } from "date-fns";
import styles from "./style";

export default function DetailsWeight({ navigation, route }) {
    const [weightEdit, setWeightEdit] = useState(route.params.weight);
    const [dateEdit, setDateEdit] = useState(parse(route.params.date, 'dd/MM/yyyy', new Date()));
    const idWeight = route.params.id;

    async function editWeight(weight, date, id) {
        try {
            const weightDocRef = doc(database, "Weights", id);
            await updateDoc(weightDocRef, {
                weight: weight,
                date: date
            });
            navigation.navigate("Weights");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Seu peso</Text>
            <TextInput 
                style={styles.inputText}
                placeholder="Exemplo: 80kgs"
                keyboardType="numeric"
                onChangeText={setWeightEdit}
                value={weightEdit}
            />

            <Text style={styles.label}>Data</Text>
                <TextInput
                    style={styles.inputText}
                    value={format(dateEdit, "dd-MM-yyyy")}
                    editable={false}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={() => {editWeight(weightEdit, dateEdit, idWeight)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}