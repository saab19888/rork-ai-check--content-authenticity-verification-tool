import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { Platform } from 'react-native';

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

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Analytics (only on web platform)
let analytics;
if (Platform.OS === 'web') {
  analytics = getAnalytics(app);
}

export { auth, analytics };
export default app;