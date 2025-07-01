import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useUserSettings } from '@/hooks/useUserSettings'
import { Key, User, Palette, Eye, EyeOff, TestTube, Check, X, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Encryption utilities
const encryptApiKey = async (apiKey: string, userSecret: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userSecret.padEnd(32, '0')),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...combined))
}

const decryptApiKey = async (encryptedKey: string, userSecret: string): Promise<string> => {
  try {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const combined = new Uint8Array(atob(encryptedKey).split('').map(char => char.charCodeAt(0)))
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userSecret.padEnd(32, '0')),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
    return decoder.decode(decrypted)
  } catch {
    return ''
  }
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user, profile, updateProfile, refreshProfile } = useAuth()
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: ''
  })

  // API Key management
  const [apiKeyForm, setApiKeyForm] = useState({
    openrouterKey: '',
    showKey: false,
    saveToAccount: true,
    isValidating: false,
    isValid: null as boolean | null
  })

  // Preferences (using settings from hook)
  const [preferences, setPreferences] = useState({
    defaultEnhancementMode: settings.defaultEnhancementMode,
    autoSaveHistory: settings.autoSaveHistory,
    theme: settings.theme
  })

  // Load user data when modal opens
  useEffect(() => {
    if (open && user && profile) {
      setProfileForm({
        fullName: profile.full_name || '',
        email: user.email || ''
      })
      
      // Load encrypted API key if exists
      loadApiKey()
    }
  }, [open, user, profile])

  const loadApiKey = async () => {
    try {
      // First check user's encrypted API key
      if (profile?.api_key_encrypted && user?.id) {
        console.log('Loading encrypted API key from profile')
        const decryptedKey = await decryptApiKey(profile.api_key_encrypted, user.id)
        if (decryptedKey && decryptedKey.trim()) {
          console.log('Successfully decrypted API key')
          setApiKeyForm(prev => ({ 
            ...prev, 
            openrouterKey: decryptedKey,
            saveToAccount: true 
          }))
          return
        }
      }
      
      // Fallback to localStorage
      const localKey = localStorage.getItem('openrouter-api-key')
      if (localKey && localKey.trim()) {
        console.log('Loading API key from localStorage')
        setApiKeyForm(prev => ({ 
          ...prev, 
          openrouterKey: localKey, 
          saveToAccount: false 
        }))
        return
      }
      
      console.log('No API key found in profile or localStorage')
    } catch (error) {
      console.error('Error loading API key:', error)
    }
  }

  const validateApiKey = async (key: string) => {
    if (!key.trim()) return null
    
    setApiKeyForm(prev => ({ ...prev, isValidating: true }))
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${key}`,
        },
      })
      
      const isValid = response.ok
      setApiKeyForm(prev => ({ ...prev, isValid, isValidating: false }))
      return isValid
    } catch {
      setApiKeyForm(prev => ({ ...prev, isValid: false, isValidating: false }))
      return false
    }
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      await updateProfile({
        full_name: profileForm.fullName,
        preferences: preferences
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApiKeySave = async () => {
    if (!apiKeyForm.openrouterKey.trim()) {
      toast.error('Please enter an API key')
      return
    }

    const isValid = await validateApiKey(apiKeyForm.openrouterKey)
    if (!isValid) {
      toast.error('Invalid API key. Please check your key and try again.')
      return
    }

    setLoading(true)
    try {
      console.log('Saving API key, saveToAccount:', apiKeyForm.saveToAccount)
      
      if (apiKeyForm.saveToAccount && user?.id) {
        // Encrypt and save to account
        console.log('Encrypting API key for user:', user.id)
        const encryptedKey = await encryptApiKey(apiKeyForm.openrouterKey, user.id)
        console.log('Encrypted key created, saving to profile...')
        
        await updateProfile({ api_key_encrypted: encryptedKey })
        
        // Remove from localStorage if moving to account
        localStorage.removeItem('openrouter-api-key')
        console.log('API key saved to account and removed from localStorage')
        toast.success('API key saved to your account securely!')
      } else {
        // Save to localStorage
        console.log('Saving API key to localStorage')
        localStorage.setItem('openrouter-api-key', apiKeyForm.openrouterKey)
        
        // Remove from account if moving to local
        if (profile?.api_key_encrypted) {
          console.log('Removing encrypted key from account')
          await updateProfile({ api_key_encrypted: null })
        }
        console.log('API key saved locally')
        toast.success('API key saved locally!')
      }
      
      // Refresh profile to update API key detection without page reload
      console.log('Refreshing profile...')
      await refreshProfile()
      console.log('Profile refreshed successfully')
    } catch (error) {
      console.error('Error saving API key:', error)
      toast.error(`Failed to save API key: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestApiKey = async () => {
    await validateApiKey(apiKeyForm.openrouterKey)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="apikeys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileForm.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="apikeys" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                <div className="relative">
                  <Input
                    id="openrouter-key"
                    type={apiKeyForm.showKey ? 'text' : 'password'}
                    value={apiKeyForm.openrouterKey}
                    onChange={(e) => setApiKeyForm(prev => ({ ...prev, openrouterKey: e.target.value, isValid: null }))}
                    placeholder="sk-or-v1-..."
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {apiKeyForm.isValidating ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : apiKeyForm.isValid === true ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : apiKeyForm.isValid === false ? (
                      <X className="h-4 w-4 text-red-600" />
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setApiKeyForm(prev => ({ ...prev, showKey: !prev.showKey }))}
                    >
                      {apiKeyForm.showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenRouter
                  </a>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="save-to-account"
                  checked={apiKeyForm.saveToAccount}
                  onCheckedChange={(checked) => setApiKeyForm(prev => ({ ...prev, saveToAccount: checked }))}
                />
                <Label htmlFor="save-to-account" className="text-sm">
                  Save to account (encrypted) - sync across devices
                </Label>
              </div>
              
              {!apiKeyForm.saveToAccount && (
                <p className="text-xs text-muted-foreground bg-orange-50 dark:bg-orange-950/20 p-2 rounded">
                  ⚠️ Saving locally means the key won't sync to other devices
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleTestApiKey}
                  variant="outline"
                  disabled={!apiKeyForm.openrouterKey.trim() || apiKeyForm.isValidating}
                  className="flex-1"
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Key
                </Button>
                <Button
                  onClick={handleApiKeySave}
                  disabled={loading || !apiKeyForm.openrouterKey.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Key'
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Enhancement Mode</Label>
                                 <select
                   value={preferences.defaultEnhancementMode}
                   onChange={(e) => setPreferences(prev => ({ ...prev, defaultEnhancementMode: e.target.value as any }))}
                   className="w-full px-3 py-2 border border-input rounded-md bg-background"
                 >
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="academic">Academic</option>
                  <option value="technical">Technical</option>
                  <option value="marketing">Marketing</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-save"
                  checked={preferences.autoSaveHistory}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSaveHistory: checked }))}
                />
                <Label htmlFor="auto-save">Automatically save prompt history</Label>
              </div>

              <Button 
                onClick={async () => {
                  await updateSettings(preferences);
                  await refreshProfile();
                }} 
                disabled={settingsLoading} 
                className="w-full"
              >
                {settingsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}