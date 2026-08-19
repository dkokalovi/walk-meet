import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWBxtlP0CepNGsc6uDQ8QVI-Qbewu7rWI",
  authDomain: "walk-meet.firebaseapp.com",
  projectId: "walk-meet",
  storageBucket: "walk-meet.firebasestorage.app",
  messagingSenderId: "469706699871",
  appId: "1:469706699871:web:da94b3e36adbf20b1e97ea",
  measurementId: "G-QSR7X1C7JF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);