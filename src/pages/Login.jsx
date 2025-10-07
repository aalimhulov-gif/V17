
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      {error && <div className="text-red-400 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="label">Email</div>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <div className="label">Пароль</div>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="btn-primary w-full">Войти</button>
      </form>
      <div className="text-sm text-zinc-400 mt-4">
        Нет аккаунта? <Link className="link" to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  )
}
