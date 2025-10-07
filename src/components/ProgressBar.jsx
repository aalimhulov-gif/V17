
import React from 'react'
import { motion } from 'framer-motion'

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  showLabel = true, 
  size = 'md',
  color = 'primary',
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)))
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
  
  const colorClasses = {
    primary: 'from-blue-500 to-purple-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    danger: 'from-red-500 to-pink-600',
    info: 'from-cyan-500 to-blue-600'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Прогресс</span>
          <span className="font-medium text-zinc-300">
            {percentage}% ({value.toLocaleString()} / {max.toLocaleString()})
          </span>
        </div>
      )}
      
      <div className={`w-full bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} relative overflow-hidden`}
        >
          {/* Анимированный блик */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
