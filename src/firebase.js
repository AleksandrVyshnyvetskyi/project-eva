import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC9DdJWQavE5mqlJyRAonBEmEiaEqU6SQE",
    authDomain: "project-eva-7b42d.firebaseapp.com",
    projectId: "project-eva-7b42d",
    storageBucket: "project-eva-7b42d.firebasestorage.app",
    messagingSenderId: "280210511185",
    appId: "1:280210511185:web:8da047c6931b71610c6f70",
    measurementId: "G-RWZ1T5L346"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };