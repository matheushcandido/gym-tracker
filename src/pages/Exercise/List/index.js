import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import styles from "./style";

export default function ListExercise({ navigation }) {
    const [exercise, setExercise] = useState([]);
    const [userId, setUserId] = useState(null);

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
            });

            return () => unsubscribe();
        }
    }, [userId]);

    function deleteExercise(id) {
        deleteDoc(doc(database, "Exercises", id));
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={exercise}
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
