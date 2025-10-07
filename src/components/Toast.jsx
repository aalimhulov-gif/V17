
import React from 'react'
export default function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-xl shadow-soft">
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button className="text-sm text-zinc-300 hover:text-white underline" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  )
}
