import React from 'react'

export default function LoadingSpinner({ text = 'Загрузка...' }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-zinc-400">{text}</p>
      </div>
    </div>
  )
}