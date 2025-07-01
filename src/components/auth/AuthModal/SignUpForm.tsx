import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { AUTH_FORM_FIELDS } from './constants';
import { FormField } from './FormField';
import type { AuthFormProps } from './types';
import { Checkbox } from '@/components/ui/checkbox';

const iconMap = {
  mail: Mail,
  lock: Lock,
  user: User,
};

export const SignUpForm: React.FC<AuthFormProps> = ({
  onSubmit,
  loading,
  formData,
  onFormChange,
  errors = {},
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        {AUTH_FORM_FIELDS.SIGN_UP.map((field) => {
          const Icon = iconMap[field.id as keyof typeof iconMap] || iconMap.mail;
          return (
            <FormField
              key={field.id}
              {...field}
              icon={<Icon className="h-4 w-4 text-muted-foreground" />}
              value={formData[field.id as keyof typeof formData] || ''}
              onChange={handleChange}
              error={errors[field.id]}
            />
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" className="mt-0.5" />
          <label
            htmlFor="terms"
            className="text-xs text-muted-foreground leading-relaxed"
          >
            I agree to the{' '}
            <a href="/terms" className="text-foreground hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-foreground hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full h-10" 
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </form>
  );
};
