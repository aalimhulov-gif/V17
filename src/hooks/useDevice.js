import { useState, useEffect } from 'react'

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('desktop')

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)
      
      if (isMobile && !isTablet) {
        setDeviceType('mobile')
      } else if (isTablet) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    detectDevice()
    
    // Обновляем при изменении размера окна (например, при повороте устройства)
    window.addEventListener('resize', detectDevice)
    
    return () => {
      window.removeEventListener('resize', detectDevice)
    }
  }, [])

  return deviceType
}

export const getDeviceIcon = (deviceType, isOnline = false) => {
  if (!isOnline) return '⚪' // Серая точка для оффлайн
  
  switch (deviceType) {
    case 'mobile':
      return '📱' // Телефон
    case 'tablet':
      return '📲' // Планшет
    case 'desktop':
    default:
      return '💻' // Компьютер
  }
}

export const getDeviceStatus = (deviceType, isOnline = false) => {
  if (!isOnline) return 'Не в сети'
  
  switch (deviceType) {
    case 'mobile':
      return 'Онлайн с телефона'
    case 'tablet':
      return 'Онлайн с планшета'
    case 'desktop':
    default:
      return 'Онлайн с компьютера'
  }
}