import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../../../config/firebaseconfig";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";
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

                list.sort((a, b) => {
                    const dateA = new Date(a.date.split('/').reverse().join('-'));
                    const dateB = new Date(b.date.split('/').reverse().join('-'));
                    return dateB - dateA;
                });

                setWeight(list);
            });

            return () => unsubscribe();
        }
    }, [userId]);

    const deleteWeight = (id) => {
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
                        deleteDoc(doc(database, "Weights", id));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={weight}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.Weights}>
                        <Text 
                            style={styles.TextWeight} 
                            onPress={() => { 
                                navigation.navigate("WeightDetails", { 
                                    id: item.id, 
                                    weight: item.weight, 
                                    date: item.date 
                                }) 
                            }}
                        >
                           Pesagem do dia <Text style={styles.boldWords}>{item.date}: {item.weight} kgs</Text>
                        </Text>
                        <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteWeight(item.id)}>
                            <FontAwesome name="trash" size={23} color="#F92e6A" />
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