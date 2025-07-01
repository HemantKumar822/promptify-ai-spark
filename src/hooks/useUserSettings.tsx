import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type EnhancementMode = "professional" | "creative" | "academic" | "technical" | "marketing" | "storytelling"

interface UserSettings {
  defaultEnhancementMode: EnhancementMode
  autoSaveHistory: boolean
  theme: 'light' | 'dark' | 'system'
}

const DEFAULT_SETTINGS: UserSettings = {
  defaultEnhancementMode: 'professional',
  autoSaveHistory: true,
  theme: 'light'
}

export function useUserSettings() {
  const { user, profile } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(false)

  // Load settings from user profile or localStorage
  useEffect(() => {
    if (user && profile) {
      // Load from user's profile preferences
      const userPrefs = profile.preferences || {}
      setSettings({
        defaultEnhancementMode: userPrefs.defaultEnhancementMode || DEFAULT_SETTINGS.defaultEnhancementMode,
        autoSaveHistory: userPrefs.autoSaveHistory !== undefined ? userPrefs.autoSaveHistory : DEFAULT_SETTINGS.autoSaveHistory,
        theme: userPrefs.theme || DEFAULT_SETTINGS.theme
      })
    } else {
      // Load from localStorage for guests
      const localSettings = localStorage.getItem('prompt-engineer-settings')
      if (localSettings) {
        try {
          const parsed = JSON.parse(localSettings)
          setSettings({ ...DEFAULT_SETTINGS, ...parsed })
        } catch {
          setSettings(DEFAULT_SETTINGS)
        }
      }
    }
  }, [user, profile])

  // Update settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setLoading(true)
    const updatedSettings = { ...settings, ...newSettings }
    
    try {
      if (user) {
        // Save to user's profile
        const { error } = await supabase
          .from('profiles')
          .update({
            preferences: {
              ...profile?.preferences,
              ...updatedSettings
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (error) throw error
        toast.success('Settings saved to your account')
      } else {
        // Save to localStorage for guests
        localStorage.setItem('prompt-engineer-settings', JSON.stringify(updatedSettings))
        toast.success('Settings saved locally')
      }
      
      setSettings(updatedSettings)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return {
    settings,
    updateSettings,
    loading,
    isSignedIn: !!user
  }
}