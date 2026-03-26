import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAS7YLCI5aMQqwuCgdicbUKlmFmU4tmWRk",
    authDomain: "salessync-a38d9.firebaseapp.com",
    projectId: "salessync-a38d9",
    storageBucket: "salessync-a38d9.firebasestorage.app",
    messagingSenderId: "924754094025",
    appId: "1:924754094025:web:a946d87aa25b8ade162a18"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);