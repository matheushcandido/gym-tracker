import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { database } from "../../../config/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./style";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';

export default function DetailsWeight({ navigation, route }) {
    const [weightEdit, setWeightEdit] = useState(route.params.weight);
    const [dateEdit, setDateEdit] = useState(route.params.date);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const idWeight = route.params.id;

    async function editWeight(weight, date, id) {
        try {
            const weightDocRef = doc(database, "Weights", id);
            await updateDoc(weightDocRef, {
                weight: weight,
                date: date
            });
            navigation.navigate("WeightList");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Seu peso</Text>
            <TextInput 
                style={styles.inputText}
                placeholder="Exemplo: 80"
                keyboardType="numeric"
                onChangeText={setWeightEdit}
                value={weightEdit}
            />

            <Text style={styles.label}>Data</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    style={styles.inputText}
                    value={dateEdit}
                    editable={false}
                />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={parse(dateEdit, "dd/MM/yyyy", new Date())}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            const formattedDate = format(selectedDate, "dd/MM/yyyy");
                            setDateEdit(formattedDate);
                        }
                        setShowDatePicker(false);
                    }}
                />
            )}
            <TouchableOpacity style={styles.buttonNew} onPress={() => {editWeight(weightEdit, dateEdit, idWeight)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}