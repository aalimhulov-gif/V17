import React, { useState } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import Modal from '../components/Modal'
import ProgressBar from '../components/ProgressBar'

export default function Goals() {
  const { goals, addGoal, contributeToGoal, profiles, currency, convert, getGoalSaved } = useBudget()
  const [open, setOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selected, setSelected] = useState(null)
  const [profileId, setProfileId] = useState('')
  const [sum, setSum] = useState('')

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Цели</h2>
        <button className="btn-primary" onClick={() => setOpen(true)}>Добавить</button>
      </div>

      {/* Список целей */}
      <div className="space-y-4">
        {goals.map(g => {
          const saved = getGoalSaved(g.id)
          const progress = Math.min((saved / g.amount) * 100, 100)
          return (
            <div key={g.id} className="card p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{g.emoji || '🎯'}</span>
                  <div>
                    <div className="font-medium">{g.name}</div>
                    {g.deadline && <div className="text-xs text-gray-500">Дедлайн: {g.deadline}</div>}
                  </div>
                </div>
                <button className="btn-secondary" onClick={() => { setSelected(g); setTransferOpen(true) }}>Перевести</button>
              </div>
              <ProgressBar value={progress} />
              <div className="text-sm mt-2">{convert(saved).toFixed(2)} / {convert(g.amount).toFixed(2)} {currency}</div>
            </div>
          )
        })}
      </div>

      {/* Модалка добавления цели */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">Новая цель</h2>
        <form onSubmit={add} className="space-y-3">
          <input
            className="input w-full"
            placeholder="Эмодзи"
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
          />
          <input
            className="input w-full"
            placeholder="Название"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="input w-full"
            type="number"
            placeholder="Сумма"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            className="input w-full"
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
          <button className="btn-primary w-full">Добавить</button>
        </form>
      </Modal>

      {/* Модалка перевода */}
      <Modal open={transferOpen} onClose={() => setTransferOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">Перевести в цель</h2>
        <form onSubmit={send} className="space-y-3">
          <select
            className="input w-full"
            value={profileId}
            onChange={e => setProfileId(e.target.value)}
          >
            <option value="">Выберите профиль</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input
            className="input w-full"
            type="number"
            placeholder="Сумма"
            value={sum}
            onChange={e => setSum(e.target.value)}
          />
          <button className="btn-primary w-full">Перевести</button>
        </form>
      </Modal>
    </div>
  )
}
