
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
}

// Проверяем что все необходимые поля заполнены
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Please check your firebaseConfig.')
}

let app, auth, db

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw new Error('Failed to initialize Firebase')
}

export { app, auth, db }
