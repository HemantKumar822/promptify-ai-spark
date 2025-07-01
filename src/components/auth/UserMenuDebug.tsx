import React from 'react'
import { useAuth } from '@/hooks/useAuth'

export function UserMenuDebug() {
  const { user, profile, loading } = useAuth()
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded max-w-xs z-[9999]">
      <div><strong>Auth Debug:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? 'exists' : 'null'}</div>
      <div>Email: {user?.email || 'none'}</div>
      <div>Profile: {profile ? 'exists' : 'null'}</div>
      <div>Avatar URL: {profile?.avatar_url || user?.user_metadata?.avatar_url || 'none'}</div>
      <div>Display Name: {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'none'}</div>
    </div>
  )
}