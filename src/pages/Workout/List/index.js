import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import styles from "./style"

export default function ListWorkout({ navigation }) {
    const [workout, setWorkout] = useState([]);

    function deleteWorkout(id) {
        deleteDoc(doc(database, "Workouts", id));
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(database, "Workouts"), (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const date = data.date && data.date.seconds ? new Date(data.date.seconds * 1000).toLocaleDateString() : '';
                list.push({ ...data, id: doc.id, date });
            });
            setWorkout(list);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={workout}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Workouts}>
                        <Text style={styles.WorkoutDate}
                        onPress={() => { navigation.navigate("WorkoutDetails", {id: item.id, date: item.date, exerciseId: item.exerciseId, repetitions: item.repetitions, weight: item.weight}) }}
                        >{item.date}</Text>
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
