import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import styles from "./style";

export default function ListExercise({ navigation }) {
    const [exercise, setExercise] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [userId, setUserId] = useState(null);
    const [search, setSearch] = useState("");

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
            const q = query(collection(database, "Exercises"), where("userId", "==", userId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                setExercise(list);
                setFilteredExercises(list);
            });

            return () => unsubscribe();
        }
    }, [userId]);

    useEffect(() => {
        const filteredData = exercise.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredExercises(filteredData);
    }, [search, exercise]);

    const deleteExercise = (id) => {
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
                        deleteDoc(doc(database, "Exercises", id));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={20} color="#F92e6a" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Procurar exercícios"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>
            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Exercises}>
                        <Text style={styles.DescriptionExercise} onPress={() =>
                            { navigation.navigate("ExerciseDetails", { id: item.id, name: item.name, category: item.category }) }}>{item.name}</Text>
                        <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteExercise(item.id)}>
                            <FontAwesome name="trash" size={23} color="#F92e6A">
                            </FontAwesome>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={() => navigation.navigate("CreateExercise")}>
                <Text style={styles.iconButton}>+</Text>
            </TouchableOpacity>
        </View>
    );
}