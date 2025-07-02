import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserSettings } from '@/hooks/useUserSettings';
import { PreferencesFormData } from '../types';

export const usePreferencesManagement = (initialState: PreferencesFormData) => {
  const { settings, updateSettings } = useUserSettings();
  const [preferences, setPreferences] = useState<PreferencesFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Sync preferences with settings from context
  useEffect(() => {
    if (settings) {
      setPreferences({
        defaultEnhancementMode: settings.defaultEnhancementMode,
        autoSaveHistory: settings.autoSaveHistory,
        theme: settings.theme,
      });
    }
  }, [settings]);

  const updatePreferences = useCallback(async (newPreferences: Partial<PreferencesFormData>) => {
    setIsLoading(true);
    try {
      await updateSettings({
        ...preferences,
        ...newPreferences,
      });
      toast.success('Preferences updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [preferences, updateSettings]);

  const toggleBooleanPreference = useCallback((key: keyof Pick<PreferencesFormData, 'autoSaveHistory'>) => {
    const newValue = !preferences[key];
    setPreferences(prev => ({
      ...prev,
      [key]: newValue
    }));
    updatePreferences({ [key]: newValue });
  }, [preferences, updatePreferences]);

  const updatePreference = useCallback((key: keyof PreferencesFormData, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    toggleBooleanPreference,
    updatePreference,
  };
};
