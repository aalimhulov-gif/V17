import { useEffect, useRef } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { useAuth } from '../firebase/auth.jsx'
import { useDeviceType } from './useDevice.js'

export const usePresence = (budgetId, profileId) => {
  const { user } = useAuth()
  const deviceType = useDeviceType()
  const presenceRef = useRef(null)
  const heartbeatRef = useRef(null)

  console.log('🔍 usePresence:', { budgetId, profileId, user: user?.email, deviceType })

  useEffect(() => {
    if (!user || !budgetId || !profileId) {
      console.log('❌ usePresence: Missing required data', { user: !!user, budgetId, profileId })
      return
    }

    console.log('🟢 usePresence: Setting up presence for', { profileId, deviceType })

    const profileDocRef = doc(db, 'budgets', budgetId, 'profiles', profileId)
    
    const updatePresence = async (isOnline) => {
      try {
        await updateDoc(profileDocRef, {
          online: isOnline,
          deviceType: deviceType,
          lastSeen: serverTimestamp(),
          userId: user.uid
        })
        console.log(`🟢 Presence updated: ${isOnline ? 'online' : 'offline'} on ${deviceType}`)
      } catch (error) {
        console.error('❌ Failed to update presence:', error)
      }
    }

    const setOnline = () => updatePresence(true)
    const setOffline = () => updatePresence(false)

    // Устанавливаем онлайн при подключении
    setOnline()

    // Heartbeat каждые 30 секунд для поддержания онлайн статуса
    heartbeatRef.current = setInterval(setOnline, 30000)

    // Обработчики событий браузера
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setOnline()
      } else {
        setOffline()
      }
    }

    const handleBeforeUnload = () => {
      setOffline()
    }

    const handleFocus = () => setOnline()
    const handleBlur = () => setOffline()

    // Регистрируем обработчики
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Cleanup функция
    return () => {
      // Очищаем heartbeat
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }

      // Убираем обработчики
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)

      // Устанавливаем оффлайн при размонтировании
      setOffline()
    }
  }, [user, budgetId, profileId, deviceType])

  // Обновляем тип устройства при его изменении
  useEffect(() => {
    if (!user || !budgetId || !profileId) return

    const updateDeviceType = async () => {
      try {
        const profileDocRef = doc(db, 'budgets', budgetId, 'profiles', profileId)
        await updateDoc(profileDocRef, {
          deviceType: deviceType,
          lastSeen: serverTimestamp()
        })
        console.log(`📱 Device type updated: ${deviceType}`)
      } catch (error) {
        console.error('❌ Failed to update device type:', error)
      }
    }

    updateDeviceType()
  }, [deviceType, user, budgetId, profileId])
}

// Хук для получения статуса других пользователей
export const useUserPresence = (profiles) => {
  const getUserStatus = (profile) => {
    if (!profile) return { isOnline: false, deviceType: 'desktop', lastSeen: null }
    
    const isOnline = profile.online || false
    const deviceType = profile.deviceType || 'desktop'
    const lastSeen = profile.lastSeen || null
    
    return { isOnline, deviceType, lastSeen }
  }

  return { getUserStatus }
}