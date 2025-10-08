
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ЗАМЕНИТЕ ПЛЕЙСХОЛДЕРЫ НА СВОИ ДАННЫЕ ИЗ FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyChItXpa02_QJXSJV3ohKjUNNi8xdW8Unw",
  authDomain: "budget-6378f.firebaseapp.com",
  projectId: "budget-6378f",
  storageBucket: "budget-6378f.firebasestorage.app",
  messagingSenderId: "267770745885",
  appId: "1:267770745885:web:a15384f0d1782c4c3222f4"
};

console.log('🔧 Initializing Firebase...')
console.log('Config check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId
})

// Проверяем что все необходимые поля заполнены
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is incomplete. Please check your firebaseConfig.')
  throw new Error('Firebase configuration is incomplete')
}

let app, auth, db

try {
  console.log('🚀 Creating Firebase app...')
  app = initializeApp(firebaseConfig)
  
  console.log('🔐 Initializing Auth...')
  auth = getAuth(app)
  
  console.log('🗄️ Initializing Firestore...')
  db = getFirestore(app)
  
  console.log('✅ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  
  // Проверяем тип ошибки
  if (error.code === 'auth/network-request-failed') {
    console.error('🚫 Network error - check your internet connection')
  } else if (error.code === 'auth/app-not-authorized') {
    console.error('🚫 App not authorized - check Firebase config')
  }
  
  throw new Error(`Failed to initialize Firebase: ${error.message}`)
}

export { app, auth, db }
