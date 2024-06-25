import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { database } from "../../../config/firebaseconfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import styles from "../Create/style";
import { format } from "date-fns";

export default function CreateWorkout({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("default");
  const [repetitions, setRepetitions] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());

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

  async function addWorkout() {
    if (!selectedExercise || selectedExercise === "default") {
      Alert.alert("Erro", "Por favor, selecione um exercício");
      return;
    }

    try {
      await addDoc(collection(database, "Workouts"), {
        exerciseId: selectedExercise,
        repetitions: parseInt(repetitions),
        weight: parseFloat(weight),
        date: date,
      });
      navigation.navigate("WorkoutList");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercício</Text>
      <Picker
        selectedValue={selectedExercise}
        style={styles.inputText}
        onValueChange={(itemValue) => setSelectedExercise(itemValue)}
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
        onChangeText={setRepetitions}
        value={repetitions}
      />

      <Text style={styles.label}>Peso</Text>
      <TextInput
        style={styles.inputText}
        placeholder="Exemplo: 50.5"
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

      <TouchableOpacity style={styles.buttonNew} onPress={addWorkout}>
        <Text style={styles.iconSave}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
