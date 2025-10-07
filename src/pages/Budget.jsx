import React, { useState } from 'react'
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

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Бюджет</h2>

      {budgetId ? (
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-400 mb-1">ID бюджета (Firestore):</div>
            <input className="input w-full" value={budgetId} readOnly />
          </div>

          <form onSubmit={saveCode} className="space-y-2">
            <div className="text-sm text-gray-400">Короткий код (редактируемый):</div>
            <input
              className="input w-full"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <button className="btn-secondary">Сохранить код</button>
          </form>
        </div>
      ) : (
        <div className="space-y-2">
          <button className="btn-primary w-full" onClick={createBudget}>
            Создать новый бюджет
          </button>
          <button className="btn-secondary w-full" onClick={() => setOpen(true)}>
            Присоединиться
          </button>
        </div>
      )}

      {/* Модалка для подключения */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">Присоединиться к бюджету</h2>
        <form onSubmit={handleJoin} className="space-y-3">
          <input
            className="input w-full"
            placeholder="ID или короткий код"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button className="btn-primary w-full">Присоединиться</button>
        </form>
      </Modal>
    </div>
  )
}
