
import React from 'react'
export default function ProgressBar({ value=0, max=100 }) {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100))
  return (
    <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
      <div className="h-3 bg-indigo-500" style={{ width: pct + '%' }} />
    </div>
  )
}
