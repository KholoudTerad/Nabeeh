import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBynC8uHoTIgvKDOjnbC4hjCB281dJDgc8",
  authDomain: "nabeeh-42e26.firebaseapp.com",
  projectId: "nabeeh-42e26",
  storageBucket: "nabeeh-42e26.firebasestorage.app",
  messagingSenderId: "1056859670066",
  appId: "1:1056859670066:web:28bd07e74a80b55184de2b",
  measurementId: "G-K3786CSKFH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Initialize Realtime Database
const storage = getStorage(app);

export { auth, db, storage  };
