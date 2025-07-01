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
import { decryptApiKey, saveApiKey } from '@/services/api' // Import from service

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
      // API key is only loaded from user profile now
      if (profile?.api_key_encrypted && user?.id) {
        console.log('Loading encrypted API key from profile')
        const decryptedKey = await decryptApiKey(profile.api_key_encrypted, user.id)
        if (decryptedKey && decryptedKey.trim()) {
          console.log('Successfully decrypted API key')
          setApiKeyForm(prev => ({ 
            ...prev, 
            openrouterKey: decryptedKey
          }))
          return
        }
      }
      console.log('No API key found in profile.')
    } catch (error) {
      console.error('Error loading API key:', error)
      toast.error('Could not load your saved API key.')
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
      if (user) {
        const success = await saveApiKey(user, apiKeyForm.openrouterKey);
        if (success) {
          // Optionally, refresh profile data if needed, but the key is saved.
          await refreshProfile()
        }
      } else {
        toast.error('You must be logged in to save an API key.')
      }
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
                <Label htmlFor="openrouterKey">OpenRouter API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="openrouterKey"
                    type={apiKeyForm.showKey ? 'text' : 'password'}
                    placeholder="sk-or-..."
                    value={apiKeyForm.openrouterKey}
                    onChange={(e) => setApiKeyForm(prev => ({ ...prev, openrouterKey: e.target.value, isValid: null }))}
                    className={cn(
                      'flex-grow',
                      apiKeyForm.isValid === true && 'border-green-500',
                      apiKeyForm.isValid === false && 'border-red-500'
                    )}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setApiKeyForm(prev => ({ ...prev, showKey: !prev.showKey }))}>
                      {apiKeyForm.showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  <Button
                    variant="outline"
                    onClick={handleTestApiKey}
                    disabled={apiKeyForm.isValidating || !apiKeyForm.openrouterKey.trim()}
                  >
                    {apiKeyForm.isValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
                    Test
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is encrypted and saved to your account. It's only used to communicate with OpenRouter and is never exposed.
                </p>
              </div>

              <Button onClick={handleApiKeySave} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                  'Save API Key'
                  )}
                </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-8 mt-6">
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