import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { decryptApiKey, saveApiKey } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { ApiKeyFormData } from '../types';

export const useApiKeyManagement = (initialState: Omit<ApiKeyFormData, 'isValidating' | 'isValid'>) => {
  const { user, profile, refreshProfile } = useAuth();
  const [apiKeyForm, setApiKeyForm] = useState<ApiKeyFormData>({
    ...initialState,
    isValidating: false,
    isValid: null,
  });

  const validateApiKey = useCallback(async (key: string) => {
    if (!key.trim()) return null;
    
    setApiKeyForm(prev => ({ ...prev, isValidating: true }));
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { "Authorization": `Bearer ${key}` },
      });
      
      const isValid = response.ok;
      setApiKeyForm(prev => ({ ...prev, isValid, isValidating: false }));
      return isValid;
    } catch (error) {
      setApiKeyForm(prev => ({ ...prev, isValid: false, isValidating: false }));
      return false;
    }
  }, []);

  const loadApiKey = useCallback(async () => {
    if (!profile?.api_key_encrypted || !user?.id) return;

    try {
      const decryptedKey = await decryptApiKey(profile.api_key_encrypted, user.id);
      if (decryptedKey?.trim()) {
        setApiKeyForm(prev => ({ 
          ...prev, 
          openrouterKey: decryptedKey 
        }));
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      toast.error('Could not load your saved API key.');
    }
  }, [user, profile]);

  const saveApiKeyToServer = useCallback(async () => {
    if (!apiKeyForm.openrouterKey.trim()) {
      toast.error('Please enter an API key');
      return false;
    }

    const isValid = await validateApiKey(apiKeyForm.openrouterKey);
    if (!isValid) {
      toast.error('Invalid API key. Please check your key and try again.');
      return false;
    }

    if (!user) {
      toast.error('You must be logged in to save an API key.');
      return false;
    }

    try {
      const success = await saveApiKey(user, apiKeyForm.openrouterKey);
      if (success) {
        await refreshProfile();
        toast.success('API key saved successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error(`Failed to save API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [apiKeyForm.openrouterKey, user, validateApiKey, refreshProfile]);

  const toggleKeyVisibility = useCallback(() => {
    setApiKeyForm(prev => ({
      ...prev,
      showKey: !prev.showKey
    }));
  }, []);

  const updateApiKey = useCallback((key: string) => {
    setApiKeyForm(prev => ({
      ...prev,
      openrouterKey: key,
      // Reset validation state when key changes
      isValid: null
    }));
  }, []);

  return {
    apiKeyForm,
    loadApiKey,
    saveApiKey: saveApiKeyToServer,
    validateApiKey,
    toggleKeyVisibility,
    updateApiKey,
  };
};
