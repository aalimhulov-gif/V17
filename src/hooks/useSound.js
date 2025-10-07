import { useCallback } from 'react'

// Создаем аудио контексты для разных звуков
const audioCache = new Map()

// Функция для создания простых звуков с помощью Web Audio API
const createTone = (frequency, duration, type = 'sine', volume = 0.1) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  oscillator.type = type
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

// Предустановленные звуки
const soundPresets = {
  success: () => {
    // Мажорный аккорд для успеха
    createTone(523.25, 0.15, 'sine', 0.08) // C5
    setTimeout(() => createTone(659.25, 0.15, 'sine', 0.06), 50) // E5
    setTimeout(() => createTone(783.99, 0.2, 'sine', 0.04), 100) // G5
  },
  
  add: () => {
    // Восходящий тон для добавления
    createTone(440, 0.1, 'sine', 0.06) // A4
    setTimeout(() => createTone(554.37, 0.1, 'sine', 0.04), 80) // C#5
  },
  
  delete: () => {
    // Нисходящий тон для удаления
    createTone(554.37, 0.1, 'square', 0.05) // C#5
    setTimeout(() => createTone(440, 0.15, 'square', 0.03), 80) // A4
  },
  
  error: () => {
    // Дисонансный звук для ошибки
    createTone(220, 0.2, 'sawtooth', 0.04)
    createTone(233.08, 0.2, 'sawtooth', 0.04)
  },
  
  click: () => {
    // Короткий клик
    createTone(800, 0.05, 'sine', 0.03)
  },
  
  notification: () => {
    // Мягкое уведомление
    createTone(523.25, 0.1, 'sine', 0.04) // C5
    setTimeout(() => createTone(659.25, 0.1, 'sine', 0.03), 100) // E5
  },
  
  coin: () => {
    // Звук монеты для транзакций
    createTone(659.25, 0.08, 'sine', 0.06) // E5
    setTimeout(() => createTone(783.99, 0.08, 'sine', 0.04), 40) // G5
    setTimeout(() => createTone(1046.5, 0.12, 'sine', 0.03), 80) // C6
  },
  
  goal: () => {
    // Звук достижения цели
    createTone(523.25, 0.1, 'sine', 0.05) // C5
    setTimeout(() => createTone(659.25, 0.1, 'sine', 0.05), 60) // E5
    setTimeout(() => createTone(783.99, 0.1, 'sine', 0.05), 120) // G5
    setTimeout(() => createTone(1046.5, 0.2, 'sine', 0.04), 180) // C6
  }
}

export const useSound = () => {
  const playSound = useCallback((soundType) => {
    // Проверяем, включены ли звуки (можно брать из настроек)
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false'
    
    if (!soundEnabled) return
    
    try {
      if (soundPresets[soundType]) {
        soundPresets[soundType]()
      }
    } catch (error) {
      console.warn('Не удалось воспроизвести звук:', error)
    }
  }, [])

  return { playSound }
}

export default useSound