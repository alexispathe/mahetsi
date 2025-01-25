// src/lib/firebaseClient.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importa getFirestore

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita inicializar múltiples instancias de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa Auth
const auth = getAuth(app);

// Establece la persistencia a nivel del navegador
setPersistence(auth, browserLocalPersistence);

// Inicializa el proveedor de Google
const provider = new GoogleAuthProvider();

// Inicializa Firestore
const db = getFirestore(app);

export { auth, provider, db }; // Exporta db junto con auth y provider
