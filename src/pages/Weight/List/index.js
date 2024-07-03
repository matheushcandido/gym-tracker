import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import { collection, query, where, onSnapshot, deleteDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./style";

export default function ListWeight({ navigation }) {
    const [weight, setWeight] = useState([]);
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
            const q = query(collection(database, "Weights"), where("userId", "==", userId));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                setWeight(list);
            });

            return () => unsubscribe();
        }
    }, [userId]);

    function deleteWeight(id) {
        deleteDoc(doc(database, "Weights", id));
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={weight}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Weights}>
                        <Text style={styles.TextWeight} onPress={() => { navigation.navigate("WeightDetails", { id: item.id, weight: item.weight, date: item.date }) }}>{item.weight}</Text>
                        <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteWeight(item.id)}>
                            <FontAwesome name="trash" size={23} color="#F92e6A">
                            </FontAwesome>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.buttonNew} onPress={() => navigation.navigate("CreateWeight")}>
                <Text style={styles.iconButton}>+</Text>
            </TouchableOpacity>
        </View>
    );
}