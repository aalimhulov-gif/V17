import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 🔧 НАСТРОЙКА FIREBASE
// Замените эти значения на ваши данные из Firebase Console
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.region.firebasedatabase.app",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}

console.log('🔧 Initializing Firebase...')
console.log('Config check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId
})

// Проверяем что все необходимые поля заполнены
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || firebaseConfig.apiKey === "your-api-key-here") {
  console.error('❌ Firebase configuration is incomplete. Please check your firebaseConfig.')
  throw new Error('Firebase configuration is incomplete. Please update firebaseConfig.js with your actual Firebase credentials.')
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