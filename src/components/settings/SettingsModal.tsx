
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useProfileManagement } from './hooks/useProfileManagement';
import { useApiKeyManagement } from './hooks/useApiKeyManagement';
import { usePreferencesManagement } from './hooks/usePreferencesManagement';
import { SettingsSection } from './SettingsSection';
import { ApiKeyInput } from './ApiKeyInput';
import { EnhancementModeSelector } from './EnhancementModeSelector';
import { ThemeSelector } from './ThemeSelector';
import { User, Key, Palette, Loader2 } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const { profileForm, updateProfileField, handleProfileUpdate, isLoading: isProfileLoading } = useProfileManagement({
    fullName: '',
    email: user?.email || '',
  });

  const { apiKeyForm, updateApiKey, toggleKeyVisibility, validateApiKey, saveApiKey, isLoading: isApiKeyLoading } = useApiKeyManagement({
    openrouterKey: '',
    showKey: false,
  });

  const { preferences, updatePreference, updatePreferences, isLoading: isPreferencesLoading } = usePreferencesManagement({
    theme: 'light',
    defaultEnhancementMode: 'professional',
    autoSaveHistory: true,
  });

  useEffect(() => {
    if (open) {
      // Load data when modal opens
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent border-b h-12">
            <TabsTrigger value="profile" className="flex items-center gap-2 h-full">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="apikeys" className="flex items-center gap-2 h-full">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 h-full">
              <Palette className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <TabsContent value="profile" className="m-0 space-y-6">
              <SettingsSection title="Personal Information" description="Update your name and view your email address.">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) => updateProfileField('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileForm.email} disabled className="bg-muted" />
                  </div>
                </div>
              </SettingsSection>
              <Button onClick={() => handleProfileUpdate(profileForm)} disabled={isProfileLoading} className="w-full sm:w-auto">
                {isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </TabsContent>

            <TabsContent value="apikeys" className="m-0 space-y-6">
              <SettingsSection title="OpenRouter API Key" description="Securely save your API key to use the prompt enhancement features.">
                <ApiKeyInput
                  value={apiKeyForm.openrouterKey}
                  onChange={updateApiKey}
                  onValidate={() => validateApiKey(apiKeyForm.openrouterKey)}
                  onSave={saveApiKey}
                  isTesting={apiKeyForm.isValidating}
                  isValid={apiKeyForm.isValid}
                  showKey={apiKeyForm.showKey}
                  onToggleVisibility={toggleKeyVisibility}
                  isSaving={isApiKeyLoading}
                />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="preferences" className="m-0 space-y-6">
              <SettingsSection title="Appearance" description="Customize the look and feel of the application.">
                <ThemeSelector value={preferences.theme} onChange={(value) => updatePreference('theme', value)} />
              </SettingsSection>
              <SettingsSection title="Behavior" description="Adjust how the application works to suit your workflow.">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Enhancement Mode</Label>
                    <EnhancementModeSelector
                      value={preferences.defaultEnhancementMode}
                      onChange={(value) => updatePreference('defaultEnhancementMode', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save prompt history</Label>
                      <p className="text-xs text-muted-foreground">Automatically save every enhanced prompt to your history.</p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={preferences.autoSaveHistory}
                      onCheckedChange={(checked) => updatePreference('autoSaveHistory', checked)}
                    />
                  </div>
                </div>
              </SettingsSection>
              <Button onClick={() => updatePreferences(preferences)} disabled={isPreferencesLoading} className="w-full sm:w-auto">
                {isPreferencesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Preferences
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
