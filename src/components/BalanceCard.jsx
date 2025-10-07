
import React from 'react'
import { motion } from 'framer-motion'

export default function BalanceCard({ title, amount, income=0, expense=0, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className="card p-6 cursor-pointer" onClick={onClick}>
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="text-3xl font-bold mt-2">{amount}</div>
      <div className="flex gap-4 mt-3 text-sm text-zinc-300">
        <div>Доход: <span className="text-green-400">{income}</span></div>
        <div>Расход: <span className="text-red-400">{expense}</span></div>
      </div>
    </motion.div>
  )
}
