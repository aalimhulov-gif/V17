import React from 'react'
import { useBudget } from '../context/BudgetProvider.jsx'
import { useAuth } from '../firebase/auth.jsx'
import { useDeviceType } from '../hooks/useDevice.js'
import { useUserPresence } from '../hooks/usePresence.js'

export default function PresenceDebug() {
  const { profiles, getCurrentUserProfile, budgetId } = useBudget()
  const { user } = useAuth()
  const deviceType = useDeviceType()
  const { getUserStatus } = useUserPresence(profiles)
  const currentProfile = getCurrentUserProfile()

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-xs text-white max-w-sm">
      <h3 className="text-lg font-bold mb-2 text-blue-400">🔍 Presence Debug</h3>
      
      <div className="space-y-2">
        <div>
          <strong>User:</strong> {user?.email || 'Not logged in'}
        </div>
        
        <div>
          <strong>Budget ID:</strong> {budgetId || 'None'}
        </div>
        
        <div>
          <strong>Device Type:</strong> {deviceType}
        </div>
        
        <div>
          <strong>Current Profile:</strong> {currentProfile?.name || 'None'} 
          {currentProfile && <span className="text-green-400"> (ID: {currentProfile.id})</span>}
        </div>
        
        <div className="border-t border-white/20 pt-2">
          <strong>All Profiles:</strong>
          {profiles.map(profile => {
            const status = getUserStatus(profile)
            return (
              <div key={profile.id} className="ml-2 text-xs">
                <span className={status.isOnline ? 'text-green-400' : 'text-gray-400'}>
                  {profile.name}
                </span>
                <span className="text-gray-500">
                  {' '}({status.deviceType}) {status.isOnline ? '🟢' : '⚪'}
                </span>
                {profile.userId && (
                  <span className="text-blue-300"> [User: {profile.userId.slice(0, 8)}...]</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}