import React, { useState } from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import { useAuth } from '../firebase/auth.jsx'
import { useSound } from '../hooks/useSound.js'

export default function ProfileSelector() {
  const { profiles, assignProfileToUser, createProfileForUser } = useBudget()
  const { user } = useAuth()
  const { playSound } = useSound()
  const [isCreating, setIsCreating] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  // Получаем незакрепленные профили
  const unclaimedProfiles = profiles.filter(p => !p.userId)

  const handleSelectProfile = async (profileId) => {
    try {
      playSound('click')
      await assignProfileToUser(profileId, user.uid)
      playSound('success')
    } catch (error) {
      console.error('Error assigning profile:', error)
      playSound('error')
    }
  }

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      playSound('error')
      return
    }

    try {
      playSound('click')
      await createProfileForUser(newProfileName.trim())
      playSound('success')
      setIsCreating(false)
      setNewProfileName('')
    } catch (error) {
      console.error('Error creating profile:', error)
      playSound('error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div 
        className="max-w-md w-full p-8 rounded-3xl"
        style={{
          background: `
            linear-gradient(145deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Выберите профиль
          </h1>
          <p className="text-zinc-400">
            Привяжите свой аккаунт к профилю в семье
          </p>
        </div>

        {unclaimedProfiles.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Доступные профили:
            </h3>
            {unclaimedProfiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => handleSelectProfile(profile.id)}
                className="w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{profile.name}</div>
                    <div className="text-sm text-zinc-400">Нажмите, чтобы выбрать</div>
                  </div>
                </div>
              </button>
            ))}
            
            <div className="text-center py-2">
              <div className="text-zinc-500">или</div>
            </div>
          </div>
        )}

        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-4 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">➕</span>
              <span className="font-medium">Создать новый профиль</span>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Введите имя профиля"
              className="w-full p-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
                className="flex-1 p-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Создать
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewProfileName('')
                }}
                className="flex-1 p-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}