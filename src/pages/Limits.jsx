import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBudget } from '../context/BudgetProvider.jsx'
import { Trash2, Edit, Plus, AlertTriangle } from 'lucide-react'

export default function Limits() {
  const { categories, spentByCategory, currency, convert, setLimitForCategory } = useBudget()
  const [editingLimit, setEditingLimit] = useState(null)
  const [newLimit, setNewLimit] = useState('')

  const saveLimit = async (categoryId, limit) => {
    try {
      await setLimitForCategory(categoryId, limit)
      setEditingLimit(null)
      setNewLimit('')
    } catch (error) {
      console.error('Ошибка сохранения лимита:', error)
    }
  }

  const startEdit = (category) => {
    setEditingLimit(category.id)
    setNewLimit(category.limit?.toString() || '')
  }

  const cancelEdit = () => {
    setEditingLimit(null)
    setNewLimit('')
  }

  const getProgressData = (category) => {
    const spent = spentByCategory[category.id] || 0
    const limit = category.limit || 0
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
    const remaining = Math.max(limit - spent, 0)
    
    return { spent, limit, percentage, remaining }
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'red'
    if (percentage >= 80) return 'yellow'
    return 'green'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 space-y-6"
    >
      {/* Заголовок */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Лимиты категорий
        </h1>
        <p className="text-zinc-400">
          Управляйте бюджетами для каждой категории
        </p>
      </motion.div>

      {/* Статистика */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4">Общая статистика</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">
              {categories.filter(cat => cat.limit > 0).length}
            </div>
            <div className="text-sm text-zinc-400">Категорий с лимитами</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">
              {categories.filter(cat => {
                const { percentage } = getProgressData(cat)
                return cat.limit > 0 && percentage < 80
              }).length}
            </div>
            <div className="text-sm text-zinc-400">В безопасной зоне</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">
              {categories.filter(cat => {
                const { percentage } = getProgressData(cat)
                return cat.limit > 0 && percentage >= 100
              }).length}
            </div>
            <div className="text-sm text-zinc-400">Лимиты превышены</div>
          </div>
        </div>
      </motion.div>

      {/* Список категорий */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Категории</h2>
        
        <div className="grid gap-4">
          {categories.map(category => {
            const { spent, limit, percentage, remaining } = getProgressData(category)
            const statusColor = getStatusColor(percentage)
            const isEditing = editingLimit === category.id

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="space-y-4">
                  {/* Заголовок категории */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <div className="text-sm text-zinc-400">
                          {category.type === 'income' ? 'Доходы' : 
                           category.type === 'expense' ? 'Расходы' : 'Универсальная'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(category)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-zinc-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Лимит и редактирование */}
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="input flex-1"
                          placeholder="Введите лимит"
                          value={newLimit}
                          onChange={e => setNewLimit(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              saveLimit(category.id, Number(newLimit))
                            }
                          }}
                        />
                        <button
                          onClick={() => saveLimit(category.id, Number(newLimit))}
                          className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-zinc-400">Лимит</div>
                          <div className="text-lg font-semibold text-white">
                            {limit > 0 ? `${convert(limit).toFixed(2)} ${currency}` : 'Не установлен'}
                          </div>
                        </div>
                        
                        {limit > 0 && (
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              statusColor === 'red' ? 'text-red-400' :
                              statusColor === 'yellow' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {statusColor === 'red' 
                                ? `Превышен на ${convert(spent - limit).toFixed(2)} ${currency}`
                                : `${convert(remaining).toFixed(2)} ${currency} осталось`
                              }
                            </div>
                            <div className="text-xs text-zinc-400">
                              {convert(spent).toFixed(2)} / {convert(limit).toFixed(2)} {currency}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Прогресс-бар */}
                    {limit > 0 && !isEditing && (
                      <div className="space-y-2">
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              statusColor === 'red' ? 'bg-red-500' :
                              statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>0 {currency}</span>
                          <span>{percentage.toFixed(1)}%</span>
                          <span>{convert(limit).toFixed(0)} {currency}</span>
                        </div>
                      </div>
                    )}

                    {/* Предупреждения */}
                    {limit > 0 && percentage >= 80 && !isEditing && (
                      <div className={`flex items-center gap-2 p-3 rounded-xl ${
                        statusColor === 'red' 
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                          : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">
                          {statusColor === 'red' 
                            ? 'Лимит превышен! Рекомендуется сократить расходы.'
                            : 'Лимит почти исчерпан. Будьте осторожны с тратами.'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}