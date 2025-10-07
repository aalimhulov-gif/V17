
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import OfflineMode from './components/OfflineMode.jsx'
import './styles/index.css'

console.log('🚀 Starting React app...')
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
})

const rootElement = document.getElementById('root')
console.log('Root element found:', !!rootElement)

if (!rootElement) {
  console.error('❌ Root element not found! Check your HTML.')
  throw new Error('Root element not found')
}

// Проверяем что Firebase доступен
let firebaseAvailable = true
try {
  // Попытаемся импортировать Firebase конфиг
  await import('./firebase/firebaseConfig.js')
  console.log('✅ Firebase config loaded')
} catch (error) {
  console.error('❌ Firebase config failed to load:', error)
  firebaseAvailable = false
}

try {
  const root = createRoot(rootElement)
  console.log('✅ React root created successfully')
  
  if (!firebaseAvailable) {
    console.log('🔧 Starting in offline mode')
    root.render(<OfflineMode />)
  } else {
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    )
  }
  
  console.log('✅ App rendered successfully')
} catch (error) {
  console.error('❌ Failed to render app:', error)
  
  // Fallback UI
  document.body.innerHTML = `
    <div style="
      min-height: 100vh; 
      background: #09090b; 
      color: #fafafa; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-family: system-ui;
      padding: 20px;
    ">
      <div style="text-align: center; max-width: 500px;">
        <h1 style="color: #ef4444; font-size: 24px; margin-bottom: 16px;">
          Ошибка загрузки приложения
        </h1>
        <p style="color: #a1a1aa; margin-bottom: 20px;">
          ${error.message}
        </p>
        <button onclick="window.location.reload()" style="
          background: #6366f1; 
          color: white; 
          padding: 12px 24px; 
          border: none; 
          border-radius: 8px; 
          cursor: pointer;
          font-size: 16px;
        ">
          Обновить страницу
        </button>
      </div>
    </div>
  `
}
