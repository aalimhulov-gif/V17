import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBudget } from '../context/BudgetProvider.jsx'
import Modal from '../components/Modal'

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBudget()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍔')
  const [type, setType] = useState('expense')
  const [limit, setLimit] = useState('')

  const save = async (e) => {
    e.preventDefault()
    const payload = { name, emoji, type, limit: limit ? parseFloat(limit) : 0 }
    if (editing) {
      await updateCategory(editing.id, payload)
    } else {
      await addCategory(payload)
    }
    setOpen(false)
    setEditing(null)
    setName('')
    setEmoji('🍔')
    setType('expense')
    setLimit('')
  }

  const startEdit = (cat) => {
    setEditing(cat)
    setName(cat.name)
    setEmoji(cat.emoji || '🍔')
    setType(cat.type || 'expense')
    setLimit(cat.limit || '')
    setOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      {/* Заголовок */}
      <motion.div variants={cardVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Категории
          </h1>
          <p className="text-zinc-400 mt-1">Управление категориями расходов</p>
        </div>
        <button 
          className="btn-primary px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform rounded-2xl" 
          onClick={() => setOpen(true)}
        >
          <span className="text-lg">+</span>
          Добавить категорию
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <div className="text-sm text-zinc-400">Всего категорий</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {categories.filter(c => c.limit > 0).length}
            </div>
            <div className="text-sm text-zinc-400">С лимитами</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {categories.reduce((sum, c) => sum + (c.limit || 0), 0).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">Общий лимит PLN</div>
          </div>
        </div>
      </motion.div>

      {/* Карточки категорий */}
      {categories.length > 0 ? (
        <motion.div variants={cardVariants} className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-300">Ваши категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-xl">
                        {category.emoji || '📂'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                        {category.limit > 0 && (
                          <p className="text-sm text-zinc-400">
                            Лимит: <span className="text-amber-400 font-medium">{category.limit} PLN</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(category)}
                      className="btn-secondary flex-1 py-2 text-sm rounded-xl"
                    >
                      ✏️ Изменить
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="btn-danger py-2 px-4 text-sm rounded-xl"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📂</div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">Пока нет категорий</h3>
          <p className="text-zinc-400 mb-6">Создайте первую категорию для организации расходов</p>
          <button 
            className="btn-primary px-6 py-3 mx-auto rounded-2xl"
            onClick={() => setOpen(true)}
          >
            Создать категорию
          </button>
        </motion.div>
      )}

      {/* Модалка для добавления/редактирования */}
      <Modal 
        open={open} 
        onClose={() => { setOpen(false); setEditing(null); setName(''); setEmoji('🍔'); setType('expense'); setLimit('') }}
        title={editing ? 'Изменить категорию' : 'Новая категория'}
      >
        <form onSubmit={save} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Эмодзи</label>
              <input
                className="input w-full text-center text-2xl"
                placeholder="🍕"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                maxLength={2}
                required
              />
              <p className="text-xs text-zinc-500">Выберите подходящий эмодзи</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Название</label>
              <input
                className="input w-full"
                placeholder="Продукты"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Тип</label>
              <select
                className="input w-full"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="income">Доходы</option>
                <option value="expense">Расходы</option>
                <option value="both">Универсальная</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Лимит расходов (необязательно)</label>
            <input
              className="input w-full"
              type="number"
              placeholder="2000"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              min="0"
              step="0.01"
            />
            <p className="text-xs text-zinc-500">Установите лимит трат по этой категории</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => { setOpen(false); setEditing(null); setName(''); setEmoji('🍔'); setType('expense'); setLimit('') }}
              className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              Отмена
            </button>
            <button 
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-6 py-3 rounded-xl border border-blue-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                backdropFilter: 'blur(10px)'
              }}
            >
              {editing ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
