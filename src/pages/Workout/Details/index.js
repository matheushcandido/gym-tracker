import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal } from "react-native";
import { database } from "../../../config/firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, updateDoc, getDocs, query, where } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import MultiSelect from "react-native-multiple-select";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';
import styles from "./style";

export default function DetailsWorkout({ navigation, route }) {
    const [exercises, setExercises] = useState([]);
    const [exerciseMap, setExerciseMap] = useState({});
    const [dateEdit, setDateEdit] = useState(route.params.date);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId, setUserId] = useState(null);
    const [workoutExercises, setWorkoutExercises] = useState(route.params.exercises);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null);
    const [repetitionsEdit, setRepetitionsEdit] = useState("");
    const [weightEdit, setWeightEdit] = useState("");
    const [selectedExercise, setSelectedExercise] = useState("default");
    const [repetitions, setRepetitions] = useState("");
    const [weight, setWeight] = useState("");
    const [selectedCategories, setSelectedCategories] = useState(route.params.categories);
    const idExercise = route.params.id;

    const categories = [
        { id: "peito", name: "Peito" },
        { id: "costas", name: "Costas" },
        { id: "pernas", name: "Pernas" },
        { id: "ombros", name: "Ombros" },
        { id: "biceps", name: "Bíceps" },
        { id: "triceps", name: "Tríceps" },
        { id: "abdomen", name: "Abdômen" },
        { id: "panturrilha", name: "Panturrilha" },
    ];

    useEffect(() => {
        const fetchExercises = async () => {
            if (!userId) return;

            let q;
            if (selectedCategories.length > 0) {
                q = query(
                    collection(database, "Exercises"),
                    where("userId", "==", userId),
                    where("category", "in", selectedCategories)
                );
            } else {
                q = collection(database, "Exercises");
            }

            try {
                const querySnapshot = await getDocs(q);
                const exerciseList = [];
                const exerciseMapping = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    exerciseList.push({ id: doc.id, name: data.name });
                    exerciseMapping[doc.id] = data.name;
                });
                setExercises(exerciseList);
                setExerciseMap(exerciseMapping);
            } catch (error) {
                console.error("Error fetching exercises: ", error);
            }
        };

        fetchExercises();
    }, [userId, selectedCategories]);

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

    const openEditModal = (index) => {
        const exercise = workoutExercises[index];
        setSelectedExerciseIndex(index);
        setSelectedExercise(exercise.exerciseId);
        setRepetitionsEdit(exercise.repetitions.toString());
        setWeightEdit(exercise.weight.toString());
        setIsEditing(true);
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
        resetModal();
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

    const addExerciseToList = () => {
        if (!selectedExercise || selectedExercise === "default" || !repetitions || !weight) {
            Alert.alert("Erro", "Por favor, preencha todos os campos do exercício");
            return;
        }

        setWorkoutExercises([...workoutExercises, {
            exerciseId: selectedExercise,
            repetitions: parseInt(repetitions),
            weight: parseFloat(weight),
        }]);

        resetModal();
    };

    const resetModal = () => {
        setSelectedExercise("default");
        setRepetitions("");
        setWeight("");
        setRepetitionsEdit("");
        setWeightEdit("");
        setSelectedExerciseIndex(null);
        setIsEditing(false);
        setModalVisible(false);
    };

    async function editWorkout(date, exercises, id) {
        try {
            const exerciseDocRef = doc(database, "Workouts", id);
            await updateDoc(exerciseDocRef, {
                date: date,
                exercises: exercises,
                categories: selectedCategories
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

            <Text style={styles.label}>Categorias</Text>
            <View style={styles.multiSelectContainer}>
                <MultiSelect
                    items={categories}
                    uniqueKey="id"
                    onSelectedItemsChange={setSelectedCategories}
                    selectedItems={selectedCategories}
                    selectText="Escolha Categorias"
                    searchInputPlaceholderText="Procurar Categorias..."
                    tagRemoveIconColor="#F92E6A"
                    tagBorderColor="#F92E6A"
                    tagTextColor="#F92E6A"
                    selectedItemTextColor="#F92E6A"
                    selectedItemIconColor="#F92E6A"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: "#F92E6A" }}
                    submitButtonColor="#F92E6A"
                    submitButtonText="Selecionar"
                    styleDropdownMenuSubsection={styles.multiSelectDropdown}
                    style={styles.multiSelectContainer}
                />
            </View>

            <Text style={styles.label}>Exercícios</Text>
            <FlatList
                data={workoutExercises}
                renderItem={renderExercise}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 120 }}
            />

            <TouchableOpacity
                style={styles.buttonAddExercise}
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <Text style={styles.iconAddExercise}>Adicionar exercício</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonNew} onPress={() => {editWorkout(dateEdit, workoutExercises, idExercise)}}>
                <Text style={styles.iconSave}>Salvar</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => resetModal()}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Exercício</Text>
                        <Picker
                            selectedValue={isEditing ? selectedExercise : selectedExercise}
                            style={styles.inputText}
                            onValueChange={(itemValue) => {
                                isEditing ? setSelectedExercise(itemValue) : setSelectedExercise(itemValue)
                            }}
                            enabled={!isEditing}
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
                            onChangeText={isEditing ? setRepetitionsEdit : setRepetitions}
                            value={isEditing ? repetitionsEdit : repetitions}
                        />

                        <Text style={styles.label}>Peso</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Exemplo: 50.5"
                            keyboardType="numeric"
                            onChangeText={isEditing ? setWeightEdit : setWeight}
                            value={isEditing ? weightEdit : weight}
                        />

                        <View style={styles.buttonContainer}>
                            {isEditing ? (
                                <TouchableOpacity style={styles.buttonConfirmAddExercise} onPress={editExerciseInList}>
                                    <Text style={styles.iconConfirmAddExercise}>Salvar</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.buttonConfirmAddExercise} onPress={addExerciseToList}>
                                    <Text style={styles.iconConfirmAddExercise}>Adicionar</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.buttonCancel} onPress={() => resetModal()}>
                                <Text style={styles.iconCancel}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}