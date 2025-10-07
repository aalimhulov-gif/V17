import React from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'

export default function Settings() {
  const { currency, setCurrency, theme, toggleTheme, rates } = useBudget()

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Настройки</h2>

      {/* Выбор валюты */}
      <div>
        <div className="mb-2 font-medium">Валюта</div>
        <select
          className="input"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        >
          <option value="PLN">PLN — Польский злотый</option>
          <option value="USD">USD — Доллар США</option>
          <option value="UAH">UAH — Украинская гривна</option>
        </select>
      </div>

      {/* Переключение темы */}
      <div>
        <div className="mb-2 font-medium">Тема</div>
        <button className="btn-secondary" onClick={toggleTheme}>
          {theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}
        </button>
      </div>

      {/* Курс валют */}
      <div>
        <div className="mb-2 font-medium">Курсы валют (к PLN)</div>
        <ul className="text-sm space-y-1">
          <li>USD: {rates?.USD ? rates.USD.toFixed(2) : '-'}</li>
          <li>UAH: {rates?.UAH ? rates.UAH.toFixed(2) : '-'}</li>
          <li>PLN: 1.00</li>
        </ul>
      </div>
    </div>
  )
}
