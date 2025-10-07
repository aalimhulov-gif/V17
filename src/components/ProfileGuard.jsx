import React from 'react'
import { useAuth } from '../firebase/auth.jsx'
import { useBudget } from '../context/BudgetProvider.jsx'
import ProfileSelector from './ProfileSelector.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function ProfileGuard({ children }) {
  const { user } = useAuth()
  const { profiles, budgetId, getCurrentUserProfile } = useBudget()
  
  // Если пользователь не авторизован, пропускаем проверку профиля
  if (!user) {
    return children
  }
  
  // Если нет бюджета, пропускаем проверку профиля
  if (!budgetId) {
    return children
  }
  
  // Ждем загрузки профилей
  if (!profiles || profiles.length === 0) {
    return <LoadingSpinner text="Загрузка профилей..." />
  }
  
  // Проверяем, есть ли у пользователя профиль
  const userProfile = getCurrentUserProfile()
  
  // Если профиль не найден, показываем селектор
  if (!userProfile) {
    return <ProfileSelector />
  }
  
  // Если всё в порядке, показываем контент
  return children
}