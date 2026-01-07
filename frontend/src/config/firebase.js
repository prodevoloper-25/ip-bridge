import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Add this

const firebaseConfig = {
  apiKey: "AIzaSyBgxqmOYsLBEQpYlrHJfrffLGV9shVXxvs",
  authDomain: "ip-bridge-1bf46.firebaseapp.com",
  projectId: "ip-bridge-1bf46",
  storageBucket: "ip-bridge-1bf46.firebasestorage.app",
  messagingSenderId: "525049920800",
  appId: "1:525049920800:web:9425c84707faabb370eb45",
  measurementId: "G-S2T5KCQN6Q"
};

const app = initializeApp(firebaseConfig);

// Export the database instance
export const db = getFirestore(app);