import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAKZ5HK41uJ4YW7pjjO138GbYC2yZgNvVU",
  authDomain: "gymtracker-dd2d1.firebaseapp.com",
  projectId: "gymtracker-dd2d1",
  storageBucket: "gymtracker-dd2d1.appspot.com",
  messagingSenderId: "431497448820",
  appId: "1:431497448820:web:5c61e015f7fab66a68f021"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { database, storage, auth };