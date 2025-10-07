import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useBudget } from '../context/BudgetProvider.jsx'
import Modal from '../components/Modal'

export default function Budget() {
  const { budgetId, budgetCode, createBudget, joinBudget, updateBudgetCode } = useBudget()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [code, setCode] = useState(budgetCode || '')

  // Присоединиться по ID или коду
  const handleJoin = async (e) => {
    e.preventDefault()
    await joinBudget(input)
    setOpen(false)
    setInput('')
  }

  // Обновить короткий код
  const saveCode = async (e) => {
    e.preventDefault()
    if (!code) return
    await updateBudgetCode(code)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Заголовок */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            👨‍👩‍👧‍👦 Семья
          </h1>
          <p className="text-zinc-400 text-lg">
            Управление семейным бюджетом
          </p>
        </div>
      </motion.div>
      {budgetId ? (
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Информация о бюджете */}
          <motion.div 
            className="backdrop-blur-2xl rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-white/20"
            style={{
              background: `
                linear-gradient(to bottom, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.08) 50%,
                  rgba(25, 25, 35, 0.8) 100%
                )
              `,
              backdropFilter: 'blur(25px) saturate(120%)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)'
            }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">🏠 Ваш семейный бюджет</h3>
                <p className="text-zinc-400">Активен и готов к использованию</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    ID бюджета (Firestore)
                  </label>
                  <div className="relative">
                    <input 
                      className="input w-full bg-black/20 border-white/10 text-zinc-300" 
                      value={budgetId} 
                      readOnly 
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500">
                      🔒
                    </div>
                  </div>
                </div>

                <form onSubmit={saveCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Короткий код (редактируемый)
                    </label>
                    <input
                      className="input w-full bg-black/20 border-white/10 text-white"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="Введите удобный код для семьи"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 rounded-xl border border-blue-500/30 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    💾 Сохранить код
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Создание/подключение к бюджету */}
          <motion.div 
            className="backdrop-blur-2xl rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-white/20"
            style={{
              background: `
                linear-gradient(to bottom, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.08) 50%,
                  rgba(25, 25, 35, 0.8) 100%
                )
              `,
              backdropFilter: 'blur(25px) saturate(120%)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)'
            }}
          >
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">🏠 Семейный бюджет</h3>
                <p className="text-zinc-400">Создайте новый или присоединитесь к существующему</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  className="p-6 rounded-xl border border-green-500/30 text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 backdrop-blur-xl group"
                  onClick={createBudget}
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                  <div className="font-medium">Создать семейный бюджет</div>
                  <div className="text-sm text-zinc-400 mt-1">Новый бюджет для вашей семьи</div>
                </button>
                
                <button 
                  className="p-6 rounded-xl border border-blue-500/30 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl group"
                  onClick={() => setOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🤝</div>
                  <div className="font-medium">Присоединиться</div>
                  <div className="text-sm text-zinc-400 mt-1">К существующему бюджету</div>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Модалка для подключения */}
      <Modal open={open} onClose={() => setOpen(false)} title="Присоединиться к семейному бюджету">
        <form onSubmit={handleJoin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              ID или короткий код
            </label>
            <input
              className="input w-full"
              placeholder="Введите ID или короткий код семьи"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => setOpen(false)}
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
              className="flex-1 px-6 py-3 rounded-xl border border-blue-500/30 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                backdropFilter: 'blur(10px)'
              }}
            >
              Присоединиться
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
