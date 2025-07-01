import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Chrome } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import type { AuthModalProps, AuthFormData } from './types';

type AuthMode = 'options' | 'signin' | 'signup';
const DEFAULT_FORM_DATA = {
  email: '',
  password: '',
  fullName: '',
  confirmPassword: '',
};

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('options');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<AuthFormData>(DEFAULT_FORM_DATA);

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

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  };

  const handleBackToOptions = () => {
    setMode('options');
    resetForm();
  };

  const renderContent = () => {
    if (mode === 'options') {
      return (
        <div className="space-y-4 px-6 pb-6">
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium justify-start"
            onClick={() => setMode('signin')}
          >
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
            Continue with Email
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-3 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium justify-start"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Chrome className="h-5 w-5 mr-3" />
            Continue with Google
          </Button>
        </div>
      );
    }

    const isSignUp = mode === 'signup';
    const FormComponent = isSignUp ? SignUpForm : SignInForm;
    
    return (
      <div className="space-y-6 px-6 pb-6">
        <div className="space-y-1">
          <button
            type="button"
            onClick={handleBackToOptions}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
          >
            ← Back to options
          </button>
          <h3 className="text-xl font-semibold">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isSignUp 
              ? 'Enter your details to create an account' 
              : 'Enter your credentials to sign in'}
          </p>
        </div>
        
        <FormComponent
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          loading={loading}
          formData={formData}
          onFormChange={handleFormChange}
          errors={errors}
          isSignUp={isSignUp}
        />
        
        <div className="text-center text-sm">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignUp ? 'signin' : 'signup');
              resetForm();
            }}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md w-[calc(100%-2rem)] rounded-lg p-0 overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center tracking-tight">
            {mode === 'options' ? 'Welcome to Promptify' : ''}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
