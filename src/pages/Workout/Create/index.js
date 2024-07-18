import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../../config/firebaseconfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import styles from "../Create/style";
import { format } from "date-fns";
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelect from "react-native-multiple-select";

export default function CreateWorkout({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("default");
  const [series, setSeries] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
      if (!userId || selectedCategories.length === 0) return;
  
      const q = query(
        collection(database, "Exercises"),
        where("userId", "==", userId),
        where("category", "in", selectedCategories)
      );
  
      const querySnapshot = await getDocs(q);
      const exerciseList = [];
      querySnapshot.forEach((doc) => {
        exerciseList.push({ id: doc.id, name: doc.data().name });
      });
      setExercises(exerciseList);
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

  const addExerciseToList = () => {
    if (!selectedExercise || selectedExercise === "default" || !series || !weight) {
      Alert.alert("Erro", "Por favor, preencha todos os campos do exercício");
      return;
    }

    setExerciseList([...exerciseList, {
      exerciseId: selectedExercise,
      series: parseInt(series),
      weight: parseFloat(weight),
    }]);

    setSelectedExercise("default");
    setSeries("");
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
        userId: userId,
        categories: selectedCategories
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
        <Text>Séries válidas: {item.series}</Text>
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
        />
      </View>

      <Text style={styles.label}>Lista de Exercícios:</Text>

      <FlatList
        data={exerciseList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExercise}
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

            <Text style={styles.label}>Quantidade de Séries</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Exemplo: 10"
              keyboardType="numeric"
              onChangeText={setSeries}
              value={series}
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