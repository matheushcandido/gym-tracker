import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../../config/firebaseconfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import styles from "../Create/style";
import { format } from "date-fns";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateWorkout({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("default");
  const [repetitions, setRepetitions] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const addExerciseToList = () => {
    if (!selectedExercise || selectedExercise === "default" || !repetitions || !weight) {
      Alert.alert("Erro", "Por favor, preencha todos os campos do exercício");
      return;
    }

    setExerciseList([...exerciseList, {
      exerciseId: selectedExercise,
      repetitions: parseInt(repetitions),
      weight: parseFloat(weight),
    }]);

    setSelectedExercise("default");
    setRepetitions("");
    setWeight("");
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
            const updatedExercises = [...exerciseList];
            updatedExercises.splice(index, 1);
            setExerciseList(updatedExercises);
          },
          style: "destructive"
        }
      ]
    );
  };

  const saveWorkout = async () => {
    if (exerciseList.length === 0) {
      Alert.alert("Erro", "Por favor, adicione pelo menos um exercício");
      return;
    }

    try {
      await addDoc(collection(database, "Workouts"), {
        exercises: exerciseList,
        date: format(date, "dd/MM/yyyy"),
        userId: userId
      });
      navigation.navigate("WorkoutList");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const renderExercise = ({ item, index }) => (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseContent}>
        <Text>{exercises.find(ex => ex.id === item.exerciseId)?.name}</Text>
        <Text>Repetições: {item.repetitions}</Text>
        <Text>Peso: {item.weight}</Text>
      </View>
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
          value={format(date, "dd/MM/yyyy")}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false);
            setDate(currentDate);
          }}
        />
      )}

      <Text style={styles.label}>Lista de Exercícios:</Text>

      <FlatList
        data={exerciseList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExercise}
      />

      <TouchableOpacity
        style={styles.buttonAddExercise}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.iconAddExercise}>Adicionar exercício</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonNew} onPress={saveWorkout}>
        <Text style={styles.iconSave}>Salvar</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonConfirmAddExercise} onPress={addExerciseToList}>
                <Text style={styles.iconConfirmAddExercise}>Adicionar</Text>
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