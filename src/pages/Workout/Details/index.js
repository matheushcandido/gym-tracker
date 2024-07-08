import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal } from "react-native";
import { database } from "../../../config/firebaseconfig";
import { collection, doc, updateDoc, getDocs } from "firebase/firestore";
import styles from "./style";

export default function DetailsWorkout({ navigation, route }) {
    const [exercises, setExercises] = useState([]);
    const [exerciseMap, setExerciseMap] = useState({});
    const [dateEdit, setDateEdit] = useState(route.params.date);
    const [workoutExercises, setWorkoutExercises] = useState(route.params.exercises);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null);
    const [repetitionsEdit, setRepetitionsEdit] = useState("");
    const [weightEdit, setWeightEdit] = useState("");
    const idExercise = route.params.id;

    useEffect(() => {
        const fetchExercises = async () => {
            const querySnapshot = await getDocs(collection(database, "Exercises"));
            const exerciseList = [];
            const exerciseMapping = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                exerciseList.push({ id: doc.id, name: data.name });
                exerciseMapping[doc.id] = data.name;
            });
            setExercises(exerciseList);
            setExerciseMap(exerciseMapping);
        };

        fetchExercises();
    }, []);

    const openEditModal = (index) => {
        const exercise = workoutExercises[index];
        setSelectedExerciseIndex(index);
        setRepetitionsEdit(exercise.repetitions.toString());
        setWeightEdit(exercise.weight.toString());
        setModalVisible(true);
    };

    const editExerciseInList = () => {
        const updatedExercises = [...workoutExercises];
        updatedExercises[selectedExerciseIndex] = {
            ...updatedExercises[selectedExerciseIndex],
            repetitions: parseInt(repetitionsEdit),
            weight: parseFloat(weightEdit)
        };
        setWorkoutExercises(updatedExercises);
        setModalVisible(false);
    };

    const deleteExercise = (index) => {
        Alert.alert(
            "Confirmação",
            "Você tem certeza que deseja excluir este exercício?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: () => {
                        const updatedExercises = [...workoutExercises];
                        updatedExercises.splice(index, 1);
                        setWorkoutExercises(updatedExercises);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    async function editWorkout(date, exercises, id) {
        try {
            const exerciseDocRef = doc(database, "Workouts", id);
            await updateDoc(exerciseDocRef, {
                date: date,
                exercises: exercises
            });
            navigation.navigate("WorkoutList");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    const renderExercise = ({ item, index }) => (
        <View style={styles.exerciseItem}>
            <TouchableOpacity onPress={() => openEditModal(index)} style={styles.exerciseContent}>
                <Text>Exercício: {exerciseMap[item.exerciseId]}</Text>
                <Text>Repetições: {item.repetitions}</Text>
                <Text>Peso: {item.weight}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteExercise(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Data</Text>
            <TextInput
                style={styles.inputText}
                value={dateEdit}
                editable={false}
            />

            <Text style={styles.label}>Exercícios</Text>
            <FlatList
                data={workoutExercises}
                renderItem={renderExercise}
                keyExtractor={(item, index) => index.toString()}
            />

            <TouchableOpacity style={styles.buttonNew} onPress={() => {editWorkout(dateEdit, workoutExercises, idExercise)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Quantidade de Repetições</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Exemplo: 10"
                            keyboardType="numeric"
                            onChangeText={setRepetitionsEdit}
                            value={repetitionsEdit}
                        />

                        <Text style={styles.label}>Peso</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Exemplo: 50.5"
                            keyboardType="numeric"
                            onChangeText={setWeightEdit}
                            value={weightEdit}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonConfirmAddExercise} onPress={editExerciseInList}>
                                <Text style={styles.iconConfirmAddExercise}>Salvar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.iconCancel}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}