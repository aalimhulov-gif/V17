import React, { useState } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import Modal from '../components/Modal'

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBudget()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍔')
  const [limit, setLimit] = useState('')

  const save = async (e) => {
    e.preventDefault()
    const payload = { name, emoji, limit: limit ? parseFloat(limit) : 0 }
    if (editing) {
      await updateCategory(editing.id, payload)
    } else {
      await addCategory(payload)
    }
    setOpen(false)
    setEditing(null)
    setName('')
    setEmoji('🍔')
    setLimit('')
  }

  const startEdit = (cat) => {
    setEditing(cat)
    setName(cat.name)
    setEmoji(cat.emoji || '🍔')
    setLimit(cat.limit || '')
    setOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Категории</h2>
        <button className="btn-primary" onClick={() => setOpen(true)}>Добавить</button>
      </div>

      {/* Таблица категорий */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2">Эмодзи</th>
              <th className="p-2">Название</th>
              <th className="p-2">Лимит</th>
              <th className="p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td className="p-2 text-xl">{c.emoji || '📂'}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.limit ? c.limit : '-'}</td>
                <td className="p-2 flex gap-2">
                  <button className="btn-secondary" onClick={() => startEdit(c)}>Изменить</button>
                  <button className="btn-danger" onClick={() => deleteCategory(c.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка для добавления/редактирования */}
      <Modal open={open} onClose={() => { setOpen(false); setEditing(null) }}>
        <h2 className="text-lg font-semibold mb-2">{editing ? 'Изменить категорию' : 'Новая категория'}</h2>
        <form onSubmit={save} className="space-y-3">
          <input
            className="input w-full"
            placeholder="Эмодзи (например 🍕)"
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
            placeholder="Лимит (PLN)"
            value={limit}
            onChange={e => setLimit(e.target.value)}
          />
          <button className="btn-primary w-full">{editing ? 'Сохранить' : 'Добавить'}</button>
        </form>
      </Modal>
    </div>
  )
}
