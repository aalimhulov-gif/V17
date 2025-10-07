
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ЗАМЕНИТЕ ПЛЕЙСХОЛДЕРЫ НА СВОИ ДАННЫЕ ИЗ FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCGN93LsNnRGcqGpesVWAg8jP0m6XsQAuA",
  authDomain: "budget-ami.firebaseapp.com",
  databaseURL: "https://budget-ami-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "budget-ami",
  storageBucket: "budget-ami.firebasestorage.app",
  messagingSenderId: "976854941281",
  appId: "1:976854941281:web:f40e81033cf52d236af420"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
