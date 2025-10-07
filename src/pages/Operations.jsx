import React, { useState } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import { Trash2 } from 'lucide-react'

export default function Operations() {
  const { operations, profiles, categories, currency, convert, deleteOperation } = useBudget()
  const [filters, setFilters] = useState({ profile: '', category: '', type: '', date: '' })

  // формат даты и времени
  const formatDate = (ts) => {
    const d = ts?.toDate ? ts.toDate() : new Date(ts)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`
  }

  const typeLabels = { income: 'Доход', expense: 'Расход', transfer: 'Перевод', goal: 'Цель' }

  // фильтрация
  const filtered = operations.filter(op => {
    if (filters.profile && op.profileId !== filters.profile) return false
    if (filters.category && op.categoryId !== filters.category) return false
    if (filters.type && op.type !== filters.type) return false
    if (filters.date) {
      const d = op.date?.toDate ? op.date.toDate() : new Date(op.date)
      const f = new Date(filters.date)
      if (d.toDateString() !== f.toDateString()) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Операции</h2>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        <select className="input" value={filters.profile} onChange={e=>setFilters(f=>({...f, profile:e.target.value}))}>
          <option value="">Все профили</option>
          {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="input" value={filters.category} onChange={e=>setFilters(f=>({...f, category:e.target.value}))}>
          <option value="">Все категории</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
        <select className="input" value={filters.type} onChange={e=>setFilters(f=>({...f, type:e.target.value}))}>
          <option value="">Все типы</option>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
          <option value="transfer">Перевод</option>
          <option value="goal">Цель</option>
        </select>
        <input type="date" className="input" value={filters.date} onChange={e=>setFilters(f=>({...f, date:e.target.value}))} />
      </div>

      {/* Таблица операций */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2">Дата</th>
              <th className="p-2">Профиль</th>
              <th className="p-2">Тип</th>
              <th className="p-2">Категория</th>
              <th className="p-2">Сумма</th>
              <th className="p-2">Заметка</th>
              <th className="p-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(op => {
              const profile = profiles.find(p => p.id === op.profileId)
              const category = categories.find(c => c.id === op.categoryId)
              const rowClass = op.type === 'income' ? 'bg-green-50 dark:bg-green-900/30' :
                               op.type === 'expense' ? 'bg-red-50 dark:bg-red-900/30' : ''
              return (
                <tr key={op.id} className={rowClass}>
                  <td className="p-2">{formatDate(op.date)}</td>
                  <td className="p-2">{profile ? profile.name : '-'}</td>
                  <td className="p-2">{typeLabels[op.type]}</td>
                  <td className="p-2">{category ? `${category.emoji} ${category.name}` : '-'}</td>
                  <td className="p-2">{convert(op.amount).toFixed(2)} {currency}</td>
                  <td className="p-2">{op.note}</td>
                  <td className="p-2">
                    <button className="text-red-500 hover:text-red-700" onClick={()=>deleteOperation(op.id)}>
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
