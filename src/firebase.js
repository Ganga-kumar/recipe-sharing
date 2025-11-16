import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyCUAurZojravI9FW2qTSVeFkwyJdIlZDo0",
  authDomain: "recipe-sharing-f49c5.firebaseapp.com",
  projectId: "recipe-sharing-f49c5",
  storageBucket: "recipe-sharing-f49c5.firebasestorage.app",
  messagingSenderId: "322827705840",
  appId: "1:322827705840:web:49822b5d9cfff1ac7f5135",
  measurementId: "G-89FKJMWZB0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ❌ No Storage (you removed it)
export default app;
