import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { database } from "../../../config/firebaseconfig";
import { collection, doc, updateDoc, getDocs } from "firebase/firestore";
import { format, parse } from "date-fns";
import styles from "./style";

export default function DetailsWorkout({ navigation, route }) {
    const [exercises, setExercises] = useState([]);
    const [dateEdit, setDateEdit] = useState(parse(route.params.date, 'dd/MM/yyyy', new Date()));
    const [exerciseIdEdit, setExerciseIdEdit] = useState(route.params.exerciseId);
    const [repetitionsEdit, setRepetitionsEdit] = useState(route.params.repetitions);
    const [weightEdit, setWeightEdit] = useState(route.params.weight);
    const idExercise = route.params.id;

    useEffect(() => {
        const fetchExercises = async () => {
            const querySnapshot = await getDocs(collection(database, "Exercises"));
            const exerciseList = [];
            querySnapshot.forEach((doc) => {
                exerciseList.push({ id: doc.id, name: doc.data().name });
            });
            setExercises(exerciseList);
        };

        fetchExercises();
    }, []);

    async function editWorkout(date, exerciseId, repetitions, weight, id) {
        if (!exerciseIdEdit || exerciseIdEdit === "default") {
            Alert.alert("Erro", "Por favor, selecione um exercício");
            return;
        }

        try {
            const exerciseDocRef = doc(database, "Workouts", id);
            await updateDoc(exerciseDocRef, {
                date: date,
                exerciseId: exerciseId,
                repetitions: repetitions,
                weight: weight
            });
            navigation.navigate("WorkoutList");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Exercício</Text>
            <Picker
                selectedValue={exerciseIdEdit}
                style={styles.inputText}
                onValueChange={(itemValue) => setExerciseIdEdit(itemValue)}
            >
                <Picker.Item label="Selecione um exercício" value="default" />
                {exercises.map((exercise) => (
                    <Picker.Item key={exercise.id} label={exercise.name} value={exercise.id} />
                ))}
            </Picker>

            <Text style={styles.label}>Quantidade de Repetições</Text>
            <TextInput
                style={styles.inputText}
                placeholder="Exemplo: 10"
                keyboardType="numeric"
                onChangeText={setRepetitionsEdit}
                value={repetitionsEdit.toString()}
            />

            <Text style={styles.label}>Peso</Text>
            <TextInput
                style={styles.inputText}
                placeholder="Exemplo: 50.5"
                keyboardType="numeric"
                onChangeText={setWeightEdit}
                value={weightEdit.toString()}
            />

            <Text style={styles.label}>Data</Text>
            <TextInput
                style={styles.inputText}
                value={format(dateEdit, "dd-MM-yyyy")}
                editable={false}
            />

            <TouchableOpacity style={styles.buttonNew} onPress={() => {editWorkout(dateEdit, exerciseIdEdit, repetitionsEdit, weightEdit, idExercise)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}