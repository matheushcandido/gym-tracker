import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";

import ListExercises from "./src/pages/Exercise/List";
import CreateExercises from "./src/pages/Exercise/Create";
import DetailsExercises from "./src/pages/Exercise/Details";

import ListWorkouts from "./src/pages/Workout/List";
import CreateWorkouts from "./src/pages/Workout/Create";
import DetailsWorkouts from "./src/pages/Workout/Details";

const ExerciseStack = createStackNavigator();
const WorkoutStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ExerciseStackScreen() {
  return (
    <ExerciseStack.Navigator initialRouteName="ExerciseList">
      <ExerciseStack.Screen name="ExerciseList" component={ListExercises} />
      <ExerciseStack.Screen name="CreateExercise" component={CreateExercises} />
      <ExerciseStack.Screen name="ExerciseDetails" component={DetailsExercises} />
    </ExerciseStack.Navigator>
  );
}

function WorkoutStackScreen() {
  return (
    <WorkoutStack.Navigator initialRouteName="WorkoutList">
      <WorkoutStack.Screen name="WorkoutList" component={ListWorkouts} />
      <WorkoutStack.Screen name="CreateWorkout" component={CreateWorkouts} />
      <WorkoutStack.Screen name="WorkoutDetails" component={DetailsWorkouts} />
    </WorkoutStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Exercises') {
              iconName = 'dumbbell';
            } else if (route.name === 'Workouts') {
              iconName = 'calendar-alt';
            }

            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Exercises" component={ExerciseStackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Workouts" component={WorkoutStackScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
