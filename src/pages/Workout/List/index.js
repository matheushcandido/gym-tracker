import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import styles from "./style";

export default function ListWorkout({ navigation }) {
    const [workout, setWorkout] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredWorkout, setFilteredWorkout] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                setUserId(user.uid);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (userId) {
            const q = query(collection(database, "Workouts"), where("userId", "==", userId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });

                list.sort((a, b) => {
                    const dateA = new Date(a.date.split('/').reverse().join('-'));
                    const dateB = new Date(b.date.split('/').reverse().join('-'));
                    return dateB - dateA;
                });

                setWorkout(list);
                setFilteredWorkout(list);
            });

            return () => unsubscribe();
        }
    }, [userId]);

    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredWorkout(workout);
        } else {
            setFilteredWorkout(workout.filter(item => item.categories.includes(selectedCategory)));
        }
    }, [selectedCategory, workout]);

    const deleteWorkout = (id) => {
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
                        deleteDoc(doc(database, "Workouts", id));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={{ height: 50, width: 200 }}
            >
                <Picker.Item label="Todos" value="all" />
                <Picker.Item label="Peito" value="peito" />
                <Picker.Item label="Costas" value="costas" />
                <Picker.Item label="Pernas" value="pernas" />
                <Picker.Item label="Ombros" value="ombros" />
                <Picker.Item label="Bíceps" value="biceps" />
                <Picker.Item label="Tríceps" value="triceps" />
                <Picker.Item label="Abdômen" value="abdomen" />
                <Picker.Item label="Panturrilha" value="panturrilha" />
            </Picker>
            <FlatList
                data={filteredWorkout}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Workouts}>
                        <Text 
                            style={styles.WorkoutDate}
                            onPress={() => { 
                                navigation.navigate("WorkoutDetails", {
                                    id: item.id,
                                    date: item.date,
                                    exercises: item.exercises,
                                    categories: item.categories
                                }) 
                            }}
                        >
                            Treino de: <Text style={styles.boldWords}>{Array.isArray(item.categories) ? item.categories.join(', ').toUpperCase() : ''}</Text> do dia <Text style={styles.boldWords}>{item.date}</Text>
                        </Text>
                        <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteWorkout(item.id)}>
                            <FontAwesome name="trash" size={23} color="#F92e6A" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={() => navigation.navigate("CreateWorkout")}>
                <Text style={styles.iconButton}>+</Text>
            </TouchableOpacity>
        </View>
    );
}