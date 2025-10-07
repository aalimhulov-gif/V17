
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth.jsx'
import { useBudget } from '../context/BudgetProvider.jsx'
import { motion, AnimatePresence } from 'framer-motion'


export default function Navbar() {
  const { user, logout } = useAuth()
  const { budgetId, theme, setTheme } = useBudget()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navItem = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl hover:bg-zinc-800 ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300'}`
      } onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  )

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-zinc-950/60 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
        <Link to="/" className="font-bold text-lg">💸 Budget Buddy</Link>
        <div className="hidden md:flex items-center gap-2 ml-4">
          {navItem('/', 'Главная')}
          {navItem('/categories', 'Категории')}
          {navItem('/goals', 'Цели')}
          {navItem('/limits', 'Лимиты')}
          {navItem('/operations', 'Операции')}
          {navItem('/settings', 'Настройки')}
          {navItem('/budget', 'Бюджет')}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="btn-secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <>
              <span className="text-sm text-zinc-400 hidden md:inline">ID бюджета: {budgetId || '—'}</span>
              <button className="btn-primary" onClick={() => logout().then(() => navigate('/login'))}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Войти</Link>
              <Link to="/register" className="btn-primary">Регистрация</Link>
            </>
          )}
          <button className="md:hidden btn-secondary" onClick={() => setOpen(!open)}>☰</button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden border-t border-zinc-800 px-4 pb-3">
            <div className="flex flex-col gap-2 pt-3">
              {navItem('/', 'Главная')}
              {navItem('/categories', 'Категории')}
              {navItem('/goals', 'Цели')}
              {navItem('/limits', 'Лимиты')}
              {navItem('/operations', 'Операции')}
              {navItem('/settings', 'Настройки')}
              {navItem('/budget', 'Бюджет')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
