import React from 'react'
import { useAuth } from '../firebase/auth.jsx'
import { useBudget } from '../context/BudgetProvider.jsx'

export default function Debug() {
  const { user, loading: authLoading, error: authError } = useAuth()
  const { budgetId, budgetCode, profiles, categories } = useBudget()

  return (
    <div className="card p-6 space-y-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">🔧 Диагностика</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-indigo-400">Аутентификация</h3>
          <div className="text-sm space-y-1">
            <div>Загрузка: {authLoading ? '✅' : '❌'}</div>
            <div>Ошибка: {authError || 'Нет'}</div>
            <div>Пользователь: {user ? `✅ ${user.email}` : '❌'}</div>
            <div>UID: {user?.uid || 'Нет'}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-indigo-400">Бюджет</h3>
          <div className="text-sm space-y-1">
            <div>ID бюджета: {budgetId || 'Нет'}</div>
            <div>Код бюджета: {budgetCode || 'Нет'}</div>
            <div>Профилей: {profiles.length}</div>
            <div>Категорий: {categories.length}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-indigo-400">Браузер</h3>
          <div className="text-sm space-y-1">
            <div>User Agent: {navigator.userAgent}</div>
            <div>Local Storage: {typeof(Storage) !== "undefined" ? '✅' : '❌'}</div>
            <div>Online: {navigator.onLine ? '✅' : '❌'}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-indigo-400">Переменные окружения</h3>
          <div className="text-sm space-y-1">
            <div>NODE_ENV: {process.env.NODE_ENV}</div>
            <div>Режим: {import.meta.env.MODE}</div>
            <div>Dev: {import.meta.env.DEV ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-indigo-400">Console Logs</h3>
        <div className="text-xs text-zinc-400">
          Откройте DevTools (F12) → Console для просмотра подробных логов
        </div>
      </div>
    </div>
  )
}