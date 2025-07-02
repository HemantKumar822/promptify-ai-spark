export type EnhancementMode = 
  | 'professional' 
  | 'creative' 
  | 'academic' 
  | 'technical' 
  | 'marketing' 
  | 'storytelling'
  | 'balanced';

export interface ProfileFormData {
  fullName: string;
  email: string;
}

export interface ApiKeyFormData {
  openrouterKey: string;
  showKey: boolean;
  isValidating: boolean;
  isValid: boolean | null;
}

export interface PreferencesFormData {
  defaultEnhancementMode: EnhancementMode;
  autoSaveHistory: boolean;
  theme: string;
}

export interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type SettingsTab = 'profile' | 'apikeys' | 'preferences';

export interface EnhancementOption {
  value: EnhancementMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}
