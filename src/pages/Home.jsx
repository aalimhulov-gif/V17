import React, { useState } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import BalanceCard from '../components/BalanceCard'
import Modal from '../components/Modal'

export default function Home() {
  const { profiles, totals, totalsByProfile, currency, convert, addOperation } = useBudget()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: 'income', profileId: '', amount: '', categoryId: '', note: '' })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.profileId || !form.amount) return
    await addOperation(form)
    setForm({ type: 'income', profileId: '', amount: '', categoryId: '', note: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Общий баланс */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Общий баланс</h1>
        <p className="text-2xl font-semibold">{convert(totals.balance).toFixed(2)} {currency}</p>
      </div>

      {/* Балансы профилей */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map(p => {
          const t = totalsByProfile[p.id] || { income: 0, expense: 0, balance: 0 }
          return (
            <BalanceCard
              key={p.id}
              name={p.name}
              balance={convert(t.balance).toFixed(2)}
              income={convert(t.income).toFixed(2)}
              expense={convert(t.expense).toFixed(2)}
              currency={currency}
              online={p.online}
              lastSeen={p.lastSeen}
              onClick={() => { setForm(f => ({ ...f, profileId: p.id })); setOpen(true) }}
            />
          )
        })}
      </div>

      {/* Модалка добавления операции */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">Добавить операцию</h2>
        <form onSubmit={submit} className="space-y-3">
          <select className="input w-full" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
            <option value="transfer">Перевод</option>
            <option value="goal">Цель</option>
          </select>
          <input className="input w-full" type="number" placeholder="Сумма" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <input className="input w-full" placeholder="Заметка" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <button className="btn-primary w-full">Добавить</button>
        </form>
      </Modal>
    </div>
  )
}
