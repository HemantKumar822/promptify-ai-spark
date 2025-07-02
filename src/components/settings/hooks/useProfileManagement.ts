import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ProfileFormData } from '../types';

export const useProfileManagement = (initialState: ProfileFormData) => {
  const { user, profile, updateProfile } = useAuth();
  const [profileForm, setProfileForm] = useState<ProfileFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Update form when profile or user data changes
  useEffect(() => {
    if (profile && user) {
      setProfileForm({
        fullName: profile.full_name || '',
        email: user.email || ''
      });
    }
  }, [profile, user]);

  const handleProfileUpdate = useCallback(async (formData: ProfileFormData) => {
    if (!user) {
      toast.error('You must be logged in to update your profile.');
      return false;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        full_name: formData.fullName,
        // Include other profile fields here if needed
      });
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateProfile, user]);

  const updateProfileField = useCallback((field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    profileForm,
    isLoading,
    handleProfileUpdate,
    updateProfileField,
  };
};
