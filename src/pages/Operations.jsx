import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBudget } from '../context/BudgetProvider.jsx'
import { useSound } from '../hooks/useSound.js'

export default function Operations() {
  const { operations, profiles, categories, currency, convert, deleteOperation } = useBudget()
  const { playSound } = useSound()
  const [filters, setFilters] = useState({ profile: '', category: '', type: '', date: '', search: '' })
  const [showFilters, setShowFilters] = useState(false)

  // Обертка для удаления с звуком
  const handleDeleteOperation = (id) => {
    deleteOperation(id)
    playSound('delete')
  }

  // формат даты и времени
  const formatDate = (ts) => {
    const d = ts?.toDate ? ts.toDate() : new Date(ts)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`
  }

  const formatDateShort = (ts) => {
    const d = ts?.toDate ? ts.toDate() : new Date(ts)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (d.toDateString() === today.toDateString()) return 'Сегодня'
    if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
    
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}.${mm}`
  }

  const typeConfig = {
    income: { label: 'Доход', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '💰' },
    expense: { label: 'Расход', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '💸' },
    transfer: { label: 'Перевод', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔄' },
    goal: { label: 'Цель', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🎯' }
  }

  // фильтрация с поиском
  const filtered = useMemo(() => {
    return operations.filter(op => {
      if (filters.profile && op.profileId !== filters.profile) return false
      if (filters.category && op.categoryId !== filters.category) return false
      if (filters.type && op.type !== filters.type) return false
      if (filters.date) {
        const d = op.date?.toDate ? op.date.toDate() : new Date(op.date)
        const f = new Date(filters.date)
        if (d.toDateString() !== f.toDateString()) return false
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const profile = profiles.find(p => p.id === op.profileId)
        const category = categories.find(c => c.id === op.categoryId)
        if (
          !op.note?.toLowerCase().includes(searchTerm) &&
          !profile?.name?.toLowerCase().includes(searchTerm) &&
          !category?.name?.toLowerCase().includes(searchTerm) &&
          !typeConfig[op.type]?.label.toLowerCase().includes(searchTerm)
        ) return false
      }
      return true
    }).sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      return dateB - dateA // новые сверху
    })
  }, [operations, filters, profiles, categories])

  // статистика
  const stats = useMemo(() => {
    const totalIncome = filtered.filter(op => op.type === 'income').reduce((sum, op) => sum + op.amount, 0)
    const totalExpense = filtered.filter(op => op.type === 'expense').reduce((sum, op) => sum + op.amount, 0)
    const totalTransfer = filtered.filter(op => op.type === 'transfer').reduce((sum, op) => sum + op.amount, 0)
    const totalGoal = filtered.filter(op => op.type === 'goal').reduce((sum, op) => sum + op.amount, 0)
    
    return { totalIncome, totalExpense, totalTransfer, totalGoal }
  }, [filtered])

  const clearFilters = () => {
    setFilters({ profile: '', category: '', type: '', date: '', search: '' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Заголовок с кнопкой фильтров */}
      <motion.div variants={cardVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Операции
          </h1>
          <p className="text-zinc-400 mt-1">История всех финансовых операций</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              showFilters ? 'bg-blue-500/20 text-blue-400' : ''
            }`}
          >
            🔍 Фильтры
            <span className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          <div className="text-sm text-zinc-400">
            Показано: <span className="text-white font-medium">{filtered.length}</span> из {operations.length}
          </div>
        </div>
      </motion.div>

      {/* Статистика */}
      <motion.div 
        variants={cardVariants} 
        className="backdrop-blur-2xl rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.08) 25%,
              rgba(255, 255, 255, 0.04) 50%,
              rgba(255, 255, 255, 0.02) 70%,
              rgba(25, 25, 35, 0.3) 90%,
              rgba(25, 25, 35, 0.6) 97%,
              rgba(25, 25, 35, 0.8) 100%
            )
          `,
          boxShadow: `
            0 8px 32px 0 rgba(0, 0, 0, 0.6),
            inset 0 2px 0 rgba(255, 255, 255, 0.3)
          `,
          backdropFilter: 'blur(25px) saturate(120%) brightness(0.9)'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              +{convert(stats.totalIncome).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">Доходы {currency}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              -{convert(stats.totalExpense).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">Расходы {currency}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {convert(stats.totalTransfer).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">Переводы {currency}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {convert(stats.totalGoal).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">В цели {currency}</div>
          </div>
        </div>
      </motion.div>

      {/* Фильтры (скрываемые) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="glass-card p-6 rounded-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Фильтры</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Очистить все
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Поиск</label>
                <input 
                  type="text" 
                  className="input w-full rounded-xl" 
                  placeholder="Поиск по заметке, профилю..."
                  value={filters.search} 
                  onChange={e => setFilters(f => ({...f, search: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Профиль</label>
                <select 
                  className="input w-full rounded-xl" 
                  value={filters.profile} 
                  onChange={e => setFilters(f => ({...f, profile: e.target.value}))}
                >
                  <option value="">Все профили</option>
                  {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Тип операции</label>
                <select 
                  className="input w-full rounded-xl" 
                  value={filters.type} 
                  onChange={e => setFilters(f => ({...f, type: e.target.value}))}
                >
                  <option value="">Все типы</option>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.icon} {config.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Категория</label>
                <select 
                  className="input w-full rounded-xl" 
                  value={filters.category} 
                  onChange={e => setFilters(f => ({...f, category: e.target.value}))}
                >
                  <option value="">Все категории</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Дата</label>
                <input 
                  type="date" 
                  className="input w-full rounded-xl" 
                  value={filters.date} 
                  onChange={e => setFilters(f => ({...f, date: e.target.value}))}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Список операций */}
      {filtered.length > 0 ? (
        <motion.div variants={cardVariants} className="space-y-4">
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((operation, index) => {
                const profile = profiles.find(p => p.id === operation.profileId)
                const category = categories.find(c => c.id === operation.categoryId)
                const config = typeConfig[operation.type]
                
                return (
                  <motion.div
                    key={operation.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.02 }}
                    className="glass-card p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.border} border flex items-center justify-center text-xl`}>
                          {config.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
                              {config.label}
                            </span>
                            {category && (
                              <span className="text-xs text-zinc-400">
                                {category.emoji} {category.name}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-zinc-300">
                            {operation.note || 'Без описания'}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                            <span>👤 {profile?.name || 'Неизвестно'}</span>
                            <span>📅 {formatDate(operation.date)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${config.color}`}>
                            {operation.type === 'expense' ? '-' : '+'}
                            {convert(operation.amount).toFixed(2)} {currency}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {formatDateShort(operation.date)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteOperation(operation.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                          title="Удалить операцию"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">
            {operations.length === 0 ? 'Нет операций' : 'Операции не найдены'}
          </h3>
          <p className="text-zinc-400 mb-6">
            {operations.length === 0 
              ? 'Добавьте первую операцию через главную страницу'
              : 'Попробуйте изменить параметры поиска'
            }
          </p>
          {operations.length > 0 && (
            <button 
              onClick={clearFilters}
              className="btn-primary px-6 py-3 rounded-2xl"
            >
              Очистить фильтры
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
