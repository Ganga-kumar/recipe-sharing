import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWz2clC_hD0Omu1EK4cgyDFHjhsycr9KU",
  authDomain: "recipe-sharing-499d1.firebaseapp.com",
  projectId: "recipe-sharing-499d1",
  storageBucket: "recipe-sharing-499d1.firebasestorage.app",
  messagingSenderId: "610502093212",
  appId: "1:610502093212:web:a4e5b371ebda9727600059",
  measurementId: "G-HP4E6523P8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ❌ No Storage (you removed it)
export default app;
