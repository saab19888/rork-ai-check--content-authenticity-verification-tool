import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNgY6TSMIpS1SZ35SfiXvAX7QN9nD-mdQ",
  authDomain: "aicheckapp.firebaseapp.com",
  projectId: "aicheckapp",
  storageBucket: "aicheckapp.firebasestorage.app",
  messagingSenderId: "238521808677",
  appId: "1:238521808677:web:4fd1f6e69e4c7eb75d8ccc",
  measurementId: "G-NXMGT387J8"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };
export default app;