
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import Home from './pages/Home.jsx'
import Categories from './pages/Categories.jsx'
import Goals from './pages/Goals.jsx'
import Operations from './pages/Operations.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Budget from './pages/Budget.jsx'
import Debug from './pages/Debug.jsx'
import { AuthProvider, useAuth } from './firebase/auth.jsx'
import { BudgetProvider } from './context/BudgetProvider.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner text="Проверяем авторизацию..." />
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  console.log('📱 App component rendering...')
  
  return (
    <AuthProvider>
      <BudgetProvider>
        <div className="min-h-screen bg-gradient-hero">
          <Navbar />
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              <Route path="/operations" element={<ProtectedRoute><Operations /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
              <Route path="/debug" element={<ProtectedRoute><Debug /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </BudgetProvider>
    </AuthProvider>
  )
}
