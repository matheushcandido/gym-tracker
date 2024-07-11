import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import styles from "./style";
import { format } from "date-fns";  // Importar a função format

export default function ListWorkout({ navigation }) {
    const [workout, setWorkout] = useState([]);
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
            const q = query(collection(database, "Workouts"), where("userId", "==", userId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });

                list.sort((a, b) => b.date - a.date);

                setWorkout(list);
            });

            return () => unsubscribe();
        }
    }, [userId]);

    function deleteWorkout(id) {
        deleteDoc(doc(database, "Workouts", id));
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={workout}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Workouts}>
                        <Text style={styles.WorkoutDate}
                        onPress={() => { navigation.navigate("WorkoutDetails", {
                            id: item.id,
                            date: item.date,
                            exercises: item.exercises
                        }) }}
                        >Treino do dia {item.date}</Text>
                        <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteWorkout(item.id)}>
                            <FontAwesome name="trash" size={23} color="#F92e6A">
                            </FontAwesome>
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