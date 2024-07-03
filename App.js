// App.js
import React, { useContext } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
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

import ListWeights from "./src/pages/Weight/List";
import CreateWeights from "./src/pages/Weight/Create";
import DetailsWeights from "./src/pages/Weight/Details";

import Login from "./src/pages/Authentication/Login";
import Register from "./src/pages/Authentication/Register";

import { AuthProvider, AuthContext } from "./src/config/authcontext"
import Logout from './src/pages/Logout';

const ExerciseStack = createStackNavigator();
const WorkoutStack = createStackNavigator();
const WeightStack = createStackNavigator();
const AuthStack = createStackNavigator();
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

function WeightStackScreen() {
  return (
    <WeightStack.Navigator initialRouteName="WeightList">
      <WeightStack.Screen name="WeightList" component={ListWeights} />
      <WeightStack.Screen name="CreateWeight" component={CreateWeights} />
      <WeightStack.Screen name="WeightDetails" component={DetailsWeights} />
    </WeightStack.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Exercises') {
            iconName = 'dumbbell';
          } else if (route.name === 'Workouts') {
            iconName = 'calendar-alt';
          } else if (route.name === 'Weights') {
              iconName = 'weight';
          } else if (route.name === 'Auth') {
            iconName = 'user';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
    >
      {user ? (
        <>
          <Tab.Screen name="Exercises" component={ExerciseStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Workouts" component={WorkoutStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Weights" component={WeightStackScreen} options={{ headerShown: false }} />
          <Tab.Screen
            name="Logout"
            options={{ tabBarIcon: ({ color, size }) => <FontAwesome5 name="sign-out-alt" size={size} color={color} /> }}
          >
            {() => <Logout />}
          </Tab.Screen>
        </>
      ) : (
        <Tab.Screen name="Auth" component={AuthStackScreen} options={{ headerShown: false }} />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
