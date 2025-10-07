import React, { useState, useEffect } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import { useAuth } from '../firebase/auth.jsx'
import { useSound } from '../hooks/useSound.js'

export default function Settings() {
  const { currency, setCurrency, theme, toggleTheme, rates, leaveFamily, budgetId } = useBudget()
  const { user } = useAuth()
  const { playSound } = useSound()
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [showDecimals, setShowDecimals] = useState(true)
  const [language, setLanguage] = useState('ru')
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('soundEnabled') !== 'false'
  )

  // Сохраняем настройку звуков в localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled)
  }, [soundEnabled])

  const handleSoundToggle = (enabled) => {
    setSoundEnabled(enabled)
    if (enabled) {
      playSound('success')
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
    playSound('click')
  }

  const handleExportData = () => {
    playSound('success')
    // Здесь будет логика экспорта
    console.log('Экспорт данных...')
  }

  const handleImportData = () => {
    playSound('notification')
    // Здесь будет логика импорта
    console.log('Импорт данных...')
  }

  const handleSync = () => {
    playSound('add')
    // Здесь будет логика синхронизации
    console.log('Синхронизация...')
  }

  const handleClearData = () => {
    playSound('error')
    // Здесь будет логика очистки с подтверждением
    console.log('Очистка данных...')
  }

  const handleLeaveFamily = async () => {
    if (!budgetId) {
      alert('Вы не состоите в семье')
      return
    }

    if (window.confirm('Вы уверены, что хотите покинуть семью? Это действие нельзя отменить.')) {
      playSound('warning')
      
      try {
        const success = await leaveFamily()
        if (success) {
          playSound('success')
          alert('Вы успешно покинули семью')
        } else {
          playSound('error')
          alert('Ошибка при выходе из семьи. Попробуйте позже.')
        }
      } catch (error) {
        console.error('Error leaving family:', error)
        playSound('error')
        alert('Произошла ошибка. Проверьте подключение к интернету.')
      }
    }
  }

  const currencyOptions = [
    { value: 'PLN', label: 'PLN — Польский злотый', flag: '🇵🇱' },
    { value: 'USD', label: 'USD — Доллар США', flag: '🇺🇸' },
    { value: 'UAH', label: 'UAH — Украинская гривна', flag: '🇺🇦' },
    { value: 'EUR', label: 'EUR — Евро', flag: '🇪🇺' },
    { value: 'RUB', label: 'RUB — Российский рубль', flag: '🇷🇺' },
  ]

  const languages = [
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'pl', label: 'Polski', flag: '🇵🇱' },
    { value: 'uk', label: 'Українська', flag: '🇺🇦' },
  ]

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-2">
          ⚙️ Настройки
        </h1>
        <p className="text-zinc-400">Персонализируйте свой опыт работы с Budget Buddy</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Профиль пользователя */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            👤 Профиль
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-medium text-white">{user?.email || 'Не авторизован'}</div>
                <div className="text-sm text-zinc-400">Основной аккаунт</div>
              </div>
            </div>
            
            <div 
              className="p-3 rounded-xl"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}
            >
              <div className="text-sm text-green-400">✅ Аккаунт подтвержден</div>
            </div>
          </div>
        </div>

        {/* Основные настройки */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🎨 Внешний вид
          </h3>
          
          <div className="space-y-4">
            {/* Тема */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Тема оформления
              </label>
              <button
                onClick={handleThemeToggle}
                className="w-full p-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, #1e293b, #334155)' 
                    : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span className="text-lg">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
                {theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
              </button>
            </div>

            {/* Язык */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Язык интерфейса
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value} style={{ background: '#1e293b' }}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Валюта и финансы */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            💰 Валюта и финансы
          </h3>
          
          <div className="space-y-4">
            {/* Выбор валюты */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Основная валюта
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                {currencyOptions.map(curr => (
                  <option key={curr.value} value={curr.value} style={{ background: '#1e293b' }}>
                    {curr.flag} {curr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Настройка отображения */}
            <div>
              <label className="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span className="text-white">Показывать десятичные разряды</span>
                <input
                  type="checkbox"
                  checked={showDecimals}
                  onChange={e => setShowDecimals(e.target.checked)}
                  className="w-5 h-5 rounded bg-transparent border-2 border-white/30 checked:bg-green-500 checked:border-green-500 transition-all duration-300"
                />
              </label>
            </div>

            {/* Курсы валют */}
            <div>
              <div className="text-sm font-medium text-zinc-300 mb-2">Текущие курсы валют</div>
              <div className="space-y-2">
                {Object.entries(rates || {}).map(([curr, rate]) => (
                  <div key={curr} className="flex justify-between items-center p-2 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <span className="text-zinc-400">{curr}:</span>
                    <span className="text-white font-medium">{rate.toFixed(2)} PLN</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-2 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <span className="text-zinc-400">PLN:</span>
                  <span className="text-white font-medium">1.00 PLN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Уведомления и поведение */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🔔 Уведомления и поведение
          </h3>
          
          <div className="space-y-4">
            {/* Уведомления */}
            <label className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <div className="text-white font-medium">Уведомления</div>
                <div className="text-sm text-zinc-400">Получать уведомления о транзакциях</div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
                className="w-5 h-5 rounded bg-transparent border-2 border-white/30 checked:bg-blue-500 checked:border-blue-500 transition-all duration-300"
              />
            </label>

            {/* Автосохранение */}
            <label className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <div className="text-white font-medium">Автосохранение</div>
                <div className="text-sm text-zinc-400">Автоматически сохранять изменения</div>
              </div>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={e => setAutoSave(e.target.checked)}
                className="w-5 h-5 rounded bg-transparent border-2 border-white/30 checked:bg-green-500 checked:border-green-500 transition-all duration-300"
              />
            </label>

            {/* Звуки */}
            <label className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <div className="text-white font-medium">Звуковые эффекты</div>
                <div className="text-sm text-zinc-400">Звуки при взаимодействии</div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => handleSoundToggle(e.target.checked)}
                className="w-5 h-5 rounded bg-transparent border-2 border-white/30 checked:bg-purple-500 checked:border-purple-500 transition-all duration-300"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Дополнительные действия */}
      <div 
        className="p-6 rounded-2xl"
        style={{
          background: `
            linear-gradient(145deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🛠️ Дополнительные действия
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button 
            onClick={handleExportData}
            className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 group"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</div>
            <div className="text-white font-medium">Экспорт данных</div>
            <div className="text-sm text-zinc-400">Скачать данные</div>
          </button>

          <button 
            onClick={handleImportData}
            className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 group"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📥</div>
            <div className="text-white font-medium">Импорт данных</div>
            <div className="text-sm text-zinc-400">Загрузить данные</div>
          </button>

          <button 
            onClick={handleSync}
            className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 group"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🔄</div>
            <div className="text-white font-medium">Синхронизация</div>
            <div className="text-sm text-zinc-400">Синхронизировать</div>
          </button>

          {/* Кнопка выхода из семьи - показывается только если пользователь в семье */}
          {budgetId && (
            <button 
              onClick={handleLeaveFamily}
              className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 group"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🚪</div>
              <div className="text-white font-medium">Покинуть семью</div>
              <div className="text-sm text-zinc-400">Выйти из группы</div>
            </button>
          )}

          <button 
            onClick={handleClearData}
            className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 group"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🗑️</div>
            <div className="text-white font-medium">Очистить данные</div>
            <div className="text-sm text-zinc-400">Удалить все</div>
          </button>
        </div>
      </div>
    </div>
  )
}
