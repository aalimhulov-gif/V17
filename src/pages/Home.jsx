import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useBudget } from '../context/BudgetProvider.jsx'
import { useAuth } from '../firebase/auth.jsx'
import { useSound } from '../hooks/useSound.js'
import { useDeviceType, getDeviceIcon, getDeviceStatus } from '../hooks/useDevice.js'
import BalanceCard from '../components/BalanceCard'
import Modal from '../components/Modal'

export default function Home() {
  const { profiles, totals, totalsByProfile, currency, convert, addOperation } = useBudget()
  const { user } = useAuth()
  const { playSound } = useSound()
  const deviceType = useDeviceType()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: 'income', profileId: '', amount: '', categoryId: '', note: '' })
  const [hoveredProfile, setHoveredProfile] = useState(null)

  // Сортировка профилей: Артур всегда первым
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.name === 'Артур') return -1
    if (b.name === 'Артур') return 1
    return 0
  })

  const openModal = () => {
    setOpen(true)
    playSound('click')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.profileId || !form.amount) return
    
    try {
      await addOperation(form)
      setForm({ type: 'income', profileId: '', amount: '', categoryId: '', note: '' })
      setOpen(false)
      
      // Воспроизводим звук в зависимости от типа операции
      if (form.type === 'income') {
        playSound('coin')
      } else if (form.type === 'expense') {
        playSound('add')
      } else if (form.type === 'transfer') {
        playSound('notification')
      } else if (form.type === 'goal') {
        playSound('goal')
      }
    } catch (error) {
      playSound('error')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Два профиля */}
      {profiles.length === 2 && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Левая секция - первый отсортированный профиль */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: hoveredProfile === 'left' ? -10 : 0 
                }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 lg:border-r lg:border-white/10 bg-white/5 cursor-pointer hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                onMouseEnter={() => setHoveredProfile('left')}
                onMouseLeave={() => setHoveredProfile(null)}
                onClick={() => { 
                  setForm(f => ({ ...f, profileId: sortedProfiles[0].id })); 
                  openModal();
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {sortedProfiles[0].name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{sortedProfiles[0].name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-lg">
                        {getDeviceIcon(deviceType, sortedProfiles[0].name === 'Артур')}
                      </span>
                      <span className="text-zinc-400">
                        {getDeviceStatus(deviceType, sortedProfiles[0].name === 'Артур')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Текущий баланс</p>
                    <p className="text-2xl font-bold text-white">
                      {convert((totalsByProfile[sortedProfiles[0].id] || { balance: 0 }).balance).toFixed(2)} 
                      <span className="text-sm text-zinc-400 ml-1">{currency}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                      <div className="text-green-400 font-medium text-sm">
                        +{convert((totalsByProfile[sortedProfiles[0].id] || { income: 0 }).income).toFixed(2)} {currency}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Доходы</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                      <div className="text-red-400 font-medium text-sm">
                        -{convert((totalsByProfile[sortedProfiles[0].id] || { expense: 0 }).expense).toFixed(2)} {currency}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Расходы</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Центральная секция - общая статистика */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 bg-gradient-to-b from-white/10 to-white/5 text-center relative"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Общий баланс</h3>
                    <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {convert(totals.balance).toFixed(2)} {currency}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-green-400">
                      <div className="font-medium">↗ {convert(totals.income).toFixed(2)} {currency}</div>
                      <div className="text-xs text-zinc-500">Общие доходы</div>
                    </div>
                    <div className="text-red-400">
                      <div className="font-medium">↘ {convert(totals.expense).toFixed(2)} {currency}</div>
                      <div className="text-xs text-zinc-500">Общие расходы</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Правая секция - второй отсортированный профиль */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: hoveredProfile === 'right' ? 10 : 0 
                }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 bg-white/5 cursor-pointer hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                onMouseEnter={() => setHoveredProfile('right')}
                onMouseLeave={() => setHoveredProfile(null)}
                onClick={() => { 
                  setForm(f => ({ ...f, profileId: sortedProfiles[1].id })); 
                  openModal();
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {sortedProfiles[1].name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{sortedProfiles[1].name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-lg">
                        {getDeviceIcon('desktop', sortedProfiles[1].name === 'Артур')}
                      </span>
                      <span className="text-zinc-400">
                        {getDeviceStatus('desktop', sortedProfiles[1].name === 'Артур')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Текущий баланс</p>
                    <p className="text-2xl font-bold text-white">
                      {convert((totalsByProfile[sortedProfiles[1].id] || { balance: 0 }).balance).toFixed(2)} 
                      <span className="text-sm text-zinc-400 ml-1">{currency}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                      <div className="text-green-400 font-medium text-sm">
                        +{convert((totalsByProfile[sortedProfiles[1].id] || { income: 0 }).income).toFixed(2)} {currency}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Доходы</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                      <div className="text-red-400 font-medium text-sm">
                        -{convert((totalsByProfile[sortedProfiles[1].id] || { expense: 0 }).expense).toFixed(2)} {currency}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Расходы</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Больше двух профилей */}
      {profiles.length > 2 && (
        <motion.div variants={itemVariants}>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="lg:col-span-2 xl:col-span-2">
              <div className="glass-card p-6 rounded-2xl h-full">
                <h3 className="text-lg font-semibold text-white mb-4">Профили семьи</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {sortedProfiles.map((p, index) => {
                    const t = totalsByProfile[p.id] || { balance: 0, income: 0, expense: 0 }
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BalanceCard
                          name={p.name}
                          balance={convert(t.balance).toFixed(2)}
                          income={convert(t.income).toFixed(2)}
                          expense={convert(t.expense).toFixed(2)}
                          currency={currency}
                          online={p.name === 'Артур'}
                          deviceType={p.name === 'Артур' ? deviceType : 'desktop'}
                          onClick={() => { 
                            setForm(f => ({ ...f, profileId: p.id })); 
                            openModal();
                          }}
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 rounded-2xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Общая статистика</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Общий баланс</p>
                    <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {convert(totals.balance).toFixed(2)} {currency}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <span className="text-green-400 text-sm">Доходы</span>
                      <span className="text-green-400 font-medium">+{convert(totals.income).toFixed(2)} {currency}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <span className="text-red-400 text-sm">Расходы</span>
                      <span className="text-red-400 font-medium">-{convert(totals.expense).toFixed(2)} {currency}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Статистические блоки */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(34, 197, 94, 0.1) 0%, 
                rgba(16, 185, 129, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-400">Доходы</h3>
              <p className="text-sm text-zinc-400">За текущий период</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            +{convert(totals.income).toFixed(2)} {currency}
          </div>
          <div className="text-sm text-green-400">
            {profiles.length} {profiles.length === 1 ? 'профиль' : profiles.length < 5 ? 'профиля' : 'профилей'}
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(239, 68, 68, 0.1) 0%, 
                rgba(220, 38, 38, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">📉</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-400">Расходы</h3>
              <p className="text-sm text-zinc-400">За текущий период</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            -{convert(totals.expense).toFixed(2)} {currency}
          </div>
          <div className="text-sm text-red-400">
            Общие траты семьи
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(99, 102, 241, 0.1) 0%, 
                rgba(139, 92, 246, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Баланс</h3>
              <p className="text-sm text-zinc-400">Общий семейный</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {convert(totals.balance).toFixed(2)} {currency}
          </div>
          <div className={`text-sm ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totals.balance >= 0 ? 'Положительный' : 'Отрицательный'}
          </div>
        </div>
      </motion.div>

      {/* Модальное окно */}
      <Modal open={open} onClose={() => setOpen(false)} title="Добавить операцию">
        <form onSubmit={submit} className="space-y-4">
          {/* Тип операции */}
          <div>
            <div className="label">Тип операции</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'income', label: 'Доход', color: 'green' },
                { value: 'expense', label: 'Расход', color: 'red' },
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: type.value }))}
                  className={`p-3 rounded-xl font-medium transition-all duration-300 ${
                    form.type === type.value
                      ? `bg-${type.color}-500/20 text-${type.color}-400 border border-${type.color}-500/30`
                      : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Сумма */}
          <div>
            <div className="label">Сумма</div>
            <input
              className="input"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          {/* Заметка */}
          <div>
            <div className="label">Заметка (необязательно)</div>
            <input
              className="input"
              placeholder="Описание операции"
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-300 hover:text-white transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
              }}
            >
              Добавить
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}