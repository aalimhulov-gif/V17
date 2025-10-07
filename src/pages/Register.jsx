
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth.jsx'

export default function Register() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await register(email, password)
      navigate('/')
    } catch (e) {
      if (e.message.includes('email-already-in-use')) {
        setError('Этот email уже используется')
      } else if (e.message.includes('weak-password')) {
        setError('Слишком простой пароль')
      } else if (e.message.includes('invalid-email')) {
        setError('Неверный формат email')
      } else {
        setError('Ошибка регистрации. Попробуйте еще раз')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 40, 0.9) 100%)
        `
      }}
    >
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            filter: 'blur(100px)'
          }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Главная карточка */}
        <div 
          className="p-8 rounded-3xl shadow-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          }}
        >
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
              ✨
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-2">
              Регистрация
            </h1>
            <p className="text-zinc-400 text-sm">Создайте аккаунт для управления бюджетом</p>
          </div>

          {/* Ошибка */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-xl text-red-300 text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {error}
            </div>
          )}

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input 
                type="email"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                placeholder="Введите ваш email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Пароль
              </label>
              <input 
                type="password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                placeholder="Минимум 6 символов"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Подтвердите пароль
              </label>
              <input 
                type="password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                placeholder="Повторите пароль"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Создание аккаунта...
                </div>
              ) : (
                'Создать аккаунт'
              )}
            </button>
          </form>

          {/* Ссылка на вход */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-zinc-400 text-sm">
              Уже есть аккаунт?{' '}
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
