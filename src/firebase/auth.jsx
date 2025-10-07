
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebaseConfig'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
        setError(null)
      }, (error) => {
        console.error('Auth state change error:', error)
        setError(error.message)
        setLoading(false)
      })
      return () => unsub()
    } catch (error) {
      console.error('Auth initialization error:', error)
      setError('Ошибка инициализации аутентификации')
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const register = async (email, password) => {
    try {
      setError(null)
      return await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const logout = async () => {
    try {
      setError(null)
      return await signOut(auth)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Ошибка подключения</h2>
          <p className="text-zinc-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  const value = {
    user, loading, error,
    login, register, logout,
  }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
