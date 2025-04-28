// filepath: c:\Users\Angel\budget-calculator\src\services\firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRLl62Eygb9N75ahf2TgYJXyGEE8DcRis",
  authDomain: "calculadora-de-presupues-45aec.firebaseapp.com",
  projectId: "calculadora-de-presupues-45aec",
  storageBucket: "calculadora-de-presupues-45aec.firebasestorage.app",
  messagingSenderId: "497282051039",
  appId: "1:497282051039:web:fa21c6bf858c1cb449b26a",
  measurementId: "G-TRRVFZ95XY",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar Firestore como valor por defecto
export default db;