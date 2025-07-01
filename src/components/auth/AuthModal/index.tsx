import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { SocialAuth } from './SocialAuth';
import { AUTH_TABS } from './constants';
import type { AuthModalProps, AuthFormData } from './types';

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: '',
      }));
    }
  };

  const validateForm = (isSignUp: boolean) => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;
    
    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
        });
      } else {
        onOpenChange(false);
        setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    
    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName || '');
      if (error) {
        setErrors({
          email: error.message.includes('email') ? 'Email already in use' : 'An error occurred',
        });
      } else {
        onOpenChange(false);
        setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (!error) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Promptify
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === 'signin' 
              ? 'Sign in to sync your prompts across all devices'
              : 'Create an account to get started'}
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none bg-transparent border-b h-12">
            {AUTH_TABS.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="relative h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="signin" className="m-0 space-y-6">
              <SignInForm
                onSubmit={handleSignIn}
                loading={loading}
                formData={formData}
                onFormChange={handleFormChange}
                errors={errors}
              />
              <SocialAuth 
                loading={loading} 
                onGoogleSignIn={handleGoogleSignIn} 
              />
            </TabsContent>

            <TabsContent value="signup" className="m-0 space-y-6">
              <SignUpForm
                onSubmit={handleSignUp}
                loading={loading}
                formData={formData}
                onFormChange={handleFormChange}
                isSignUp
                errors={errors}
              />
              <SocialAuth 
                loading={loading} 
                onGoogleSignIn={handleGoogleSignIn} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
