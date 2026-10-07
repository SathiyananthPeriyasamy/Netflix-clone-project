import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCxzJwDpuEOLN8pXBwwyQBPGaAgUJt4XNU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "netflix-app-b1ceb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "netflix-app-b1ceb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "netflix-app-b1ceb.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "831382733227",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:831382733227:web:da26ea591d05fe8dc952ee"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
