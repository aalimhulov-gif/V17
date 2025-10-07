import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBudget } from '../context/BudgetProvider.jsx'
import Modal from '../components/Modal'
import ProgressBar from '../components/ProgressBar'

export default function Goals() {
  const { goals, addGoal, editGoal, deleteGoal, contributeToGoal, profiles, currency, convert, getGoalSaved } = useBudget()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selected, setSelected] = useState(null)
  const [profileId, setProfileId] = useState('')
  const [sum, setSum] = useState('')
  const [editingGoal, setEditingGoal] = useState(null)

  // добавление новой цели
  const add = async (e) => {
    e.preventDefault()
    await addGoal({ name, emoji, amount: parseFloat(amount), deadline })
    setOpen(false)
    setName('')
    setEmoji('🎯')
    setAmount('')
    setDeadline('')
  }

  // перевод в цель
  const send = async (e) => {
    e.preventDefault()
    if (!selected || !profileId || !sum) return
    await contributeToGoal(selected.id, profileId, parseFloat(sum))
    setTransferOpen(false)
    setProfileId('')
    setSum('')
  }

  // начало редактирования цели
  const startEdit = (goal) => {
    setEditingGoal(goal)
    setName(goal.name)
    setEmoji(goal.emoji || '🎯')
    setAmount(goal.amount.toString())
    setDeadline(goal.deadline || '')
    setEditOpen(true)
  }

  // сохранение изменений цели
  const saveEdit = async (e) => {
    e.preventDefault()
    await editGoal(editingGoal.id, {
      name,
      emoji,
      amount: parseFloat(amount),
      deadline
    })
    setEditOpen(false)
    setEditingGoal(null)
    setName('')
    setEmoji('🎯')
    setAmount('')
    setDeadline('')
  }

  // удаление цели
  const handleDelete = async (goalId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту цель?')) {
      await deleteGoal(goalId)
    }
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

  const totalSaved = goals.reduce((sum, g) => sum + getGoalSaved(g.id), 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.amount, 0)
  const completedGoals = goals.filter(g => getGoalSaved(g.id) >= g.amount).length

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
            Цели
          </h1>
          <p className="text-zinc-400 mt-1">Планируйте и достигайте финансовых целей</p>
        </div>
        <button 
          className="btn-primary px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform rounded-2xl" 
          onClick={() => setOpen(true)}
        >
          <span className="text-lg">+</span>
          Добавить цель
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{goals.length}</div>
            <div className="text-sm text-zinc-400">Всего целей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedGoals}</div>
            <div className="text-sm text-zinc-400">Достигнуто</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {convert(totalSaved).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">Накоплено {currency}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {convert(totalTarget).toFixed(0)}
            </div>
            <div className="text-sm text-zinc-400">Общая цель {currency}</div>
          </div>
        </div>
      </motion.div>

      {/* Карточки целей */}
      {goals.length > 0 ? (
        <motion.div variants={cardVariants} className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-300">Ваши цели</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {goals.map((goal, index) => {
                const saved = getGoalSaved(goal.id)
                const progress = Math.min((saved / goal.amount) * 100, 100)
                const isCompleted = saved >= goal.amount
                const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
                
                return (
                  <motion.div
                    key={goal.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 ${
                      isCompleted ? 'ring-2 ring-green-400/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-xl">
                          {goal.emoji || '🎯'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                            {goal.name}
                            {isCompleted && <span className="text-green-400">✅</span>}
                          </h3>
                          {goal.deadline && (
                            <p className="text-sm text-zinc-400">
                              {daysLeft > 0 ? (
                                <span className={daysLeft <= 7 ? 'text-orange-400' : 'text-zinc-400'}>
                                  📅 {daysLeft} дней осталось
                                </span>
                              ) : daysLeft === 0 ? (
                                <span className="text-red-400">📅 Сегодня дедлайн!</span>
                              ) : (
                                <span className="text-red-400">📅 Просрочено на {Math.abs(daysLeft)} дней</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(goal)}
                          className="btn-secondary py-2 px-3 text-sm rounded-xl hover:scale-105 transition-transform"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="btn-secondary py-2 px-3 text-sm rounded-xl hover:scale-105 transition-transform hover:bg-red-500/20"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => { setSelected(goal); setTransferOpen(true) }}
                          className="btn-secondary py-2 px-4 text-sm rounded-xl hover:scale-105 transition-transform"
                          disabled={isCompleted}
                        >
                          💰 Пополнить
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <ProgressBar 
                        value={saved} 
                        max={goal.amount} 
                        color={isCompleted ? 'success' : progress >= 75 ? 'warning' : 'primary'}
                        showLabel={true}
                      />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">
                          Прогресс: {progress.toFixed(1)}%
                        </span>
                        <span className="text-white font-medium">
                          {convert(saved).toFixed(2)} / {convert(goal.amount).toFixed(2)} {currency}
                        </span>
                      </div>

                      {isCompleted && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                          <span className="text-green-400 font-medium">🎉 Цель достигнута!</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={cardVariants} className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🎯</div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">Пока нет целей</h3>
          <p className="text-zinc-400 mb-6">Поставьте первую финансовую цель и начните копить</p>
          <button 
            className="btn-primary px-6 py-3 mx-auto rounded-2xl"
            onClick={() => setOpen(true)}
          >
            Поставить цель
          </button>
        </motion.div>
      )}

      {/* Модалка добавления цели */}
      <Modal 
        open={open} 
        onClose={() => { setOpen(false); setName(''); setEmoji('🎯'); setAmount(''); setDeadline('') }}
        title="Новая цель"
      >
        <form onSubmit={add} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Эмодзи</label>
              <input
                className="input w-full text-center text-2xl rounded-xl"
                placeholder="🎯"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                maxLength={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Название цели</label>
              <input
                className="input w-full rounded-xl"
                placeholder="Подушка безопасности"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Целевая сумма</label>
              <input
                className="input w-full rounded-xl"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-zinc-500">Сумма в {currency}</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Дедлайн (необязательно)</label>
              <input
                className="input w-full rounded-xl"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => { setOpen(false); setName(''); setEmoji('🎯'); setAmount(''); setDeadline('') }}
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
              disabled={!name.trim() || !amount}
              className="flex-1 px-6 py-3 rounded-xl border border-blue-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                backdropFilter: 'blur(10px)'
              }}
            >
              Создать цель
            </button>
          </div>
        </form>
      </Modal>

      {/* Модалка редактирования */}
      <Modal 
        open={editOpen} 
        onClose={() => { 
          setEditOpen(false)
          setEditingGoal(null)
          setName('')
          setEmoji('🎯')
          setAmount('')
          setDeadline('')
        }}
        title="Редактировать цель"
      >
        <form onSubmit={saveEdit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Эмодзи</label>
              <input
                className="input w-full text-center text-2xl rounded-xl"
                placeholder="🎯"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                maxLength={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Название цели</label>
              <input
                className="input w-full rounded-xl"
                placeholder="Подушка безопасности"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Целевая сумма</label>
              <input
                className="input w-full rounded-xl"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-zinc-500">Сумма в {currency}</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Дедлайн (необязательно)</label>
              <input
                className="input w-full rounded-xl"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => {
                setEditOpen(false)
                setEditingGoal(null)
                setName('')
                setEmoji('🎯')
                setAmount('')
                setDeadline('')
              }}
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
              disabled={!name.trim() || !amount}
              className="flex-1 px-6 py-3 rounded-xl border border-blue-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                backdropFilter: 'blur(10px)'
              }}
            >
              Сохранить
            </button>
          </div>
        </form>
      </Modal>

      {/* Модалка перевода */}
      <Modal 
        open={transferOpen} 
        onClose={() => { setTransferOpen(false); setProfileId(''); setSum('') }}
        title={`Пополнить цель "${selected?.name}"`}
      >
        <form onSubmit={send} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Выберите профиль</label>
            <select
              className="input w-full rounded-xl"
              value={profileId}
              onChange={e => setProfileId(e.target.value)}
              required
            >
              <option value="">Выберите профиль для списания</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Сумма пополнения</label>
            <input
              className="input w-full rounded-xl"
              type="number"
              placeholder="1000"
              value={sum}
              onChange={e => setSum(e.target.value)}
              min="0"
              step="0.01"
              required
            />
            <p className="text-xs text-zinc-500">Сумма в {currency}</p>
          </div>

          {selected && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="text-sm text-zinc-300">
                <div className="flex justify-between mb-2">
                  <span>Текущий прогресс:</span>
                  <span>{convert(getGoalSaved(selected.id)).toFixed(2)} / {convert(selected.amount).toFixed(2)} {currency}</span>
                </div>
                <ProgressBar 
                  value={getGoalSaved(selected.id)} 
                  max={selected.amount} 
                  size="sm"
                  showLabel={false}
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => { setTransferOpen(false); setProfileId(''); setSum('') }}
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
              disabled={!profileId || !sum}
              className="flex-1 px-6 py-3 rounded-xl border border-blue-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                backdropFilter: 'blur(10px)'
              }}
            >
              Пополнить
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
