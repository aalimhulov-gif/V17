
import React from 'react'
import { motion } from 'framer-motion'
import { getDeviceIcon, getDeviceStatus } from '../hooks/useDevice.js'

export default function BalanceCard({ 
  name, 
  balance, 
  income = 0, 
  expense = 0, 
  currency = 'PLN',
  online = false,
  deviceType = 'desktop',
  onClick 
}) {
  const formatAmount = (amount) => {
    const num = parseFloat(amount) || 0
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const getBalanceColor = (balance) => {
    const num = parseFloat(balance) || 0
    if (num > 0) return 'text-emerald-400'
    if (num < 0) return 'text-red-400'
    return 'text-zinc-300'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }} 
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="balance-card group"
      onClick={onClick}
    >
      {/* Заголовок с статусом онлайн */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-base">
                {getDeviceIcon(deviceType, online)}
              </span>
              <span className="text-sm text-zinc-400">
                {getDeviceStatus(deviceType, online)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Основной баланс */}
      <div className="mb-6">
        <div className="text-sm text-zinc-400 mb-1">Текущий баланс</div>
        <div className={`text-3xl font-bold transition-colors ${getBalanceColor(balance)}`}>
          {formatAmount(balance)} {currency}
        </div>
      </div>

      {/* Статистика доходов и расходов */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-xs text-emerald-400 font-medium">ДОХОДЫ</div>
          <div className="text-lg font-semibold text-emerald-400">
            +{formatAmount(income)} {currency}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-xs text-red-400 font-medium">РАСХОДЫ</div>
          <div className="text-lg font-semibold text-red-400">
            -{formatAmount(expense)} {currency}
          </div>
        </div>
      </div>

      {/* Кнопка действия */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium text-zinc-300">
          Нажмите для добавления операции
        </div>
      </div>

      {/* Градиентный border эффект при hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
