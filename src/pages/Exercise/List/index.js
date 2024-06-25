import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { database } from "../../../config/firebaseconfig";
import { collection, onSnapshot } from "firebase/firestore";
import styles from "./style"

export default function ListExercise({ navigation }) {
    const [exercise, setExercise] = useState([]);

    function deleteExercise(id){
        database.collection("Exercises").doc(id).delete();
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(database, "Exercises"), (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id });
            });
            setExercise(list);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={exercise}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Exercises}>
                        <Text style={styles.DescriptionExercise} onPress={() => { navigation.navigate("ExerciseDetails", {id: item.id, name: item.name}) }}>{item.name}</Text>
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
