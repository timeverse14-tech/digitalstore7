// Firebase configuration for PixelVault Store
// In demo mode (mock/missing keys), Firebase is not initialized.
// Auth and data use localStorage fallbacks throughout the app.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;
let storage = null;

// Only initialize Firebase if we have real credentials (not mock values)
const hasRealConfig = firebaseConfig.apiKey
  && !firebaseConfig.apiKey.startsWith('mock')
  && firebaseConfig.apiKey !== 'undefined';

if (hasRealConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[PixelVault] Firebase initialized successfully');
  } catch (error) {
    console.warn('[PixelVault] Firebase initialization failed:', error.message);
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else {
  console.warn('[PixelVault] Running in demo mode — Firebase not configured. Auth and data use localStorage.');
}

export { app, auth, db, storage };
