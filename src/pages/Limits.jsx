import React, { useState } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import Modal from '../components/Modal'

export default function Limits() {
  const { categories, setLimitForCategory } = useBudget()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [limit, setLimit] = useState('')

  const start = (c) => {
    setSelected(c)
    setLimit(c.limit || '')
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    await setLimitForCategory(selected.id, limit)
    setOpen(false)
    setSelected(null)
    setLimit('')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Лимиты</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2">Категория</th>
              <th className="p-2">Лимит</th>
              <th className="p-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td className="p-2">{c.emoji} {c.name}</td>
                <td className="p-2">{c.limit || '-'}</td>
                <td className="p-2">
                  <button className="btn-secondary text-sm" onClick={() => start(c)}>Настроить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка изменения лимита */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">Настроить лимит</h2>
        <form onSubmit={save} className="space-y-3">
          <input
            className="input w-full"
            type="number"
            placeholder="Лимит (PLN)"
            value={limit}
            onChange={e => setLimit(e.target.value)}
          />
          <button className="btn-primary w-full">Сохранить</button>
        </form>
      </Modal>
    </div>
  )
}
