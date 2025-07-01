import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock } from 'lucide-react';
import { AUTH_FORM_FIELDS } from './constants';
import { FormField } from './FormField';
import type { AuthFormProps } from './types';

const iconMap = {
  mail: Mail,
  lock: Lock,
};

export const SignInForm: React.FC<AuthFormProps> = ({
  onSubmit,
  loading,
  formData,
  onFormChange,
  errors,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        {AUTH_FORM_FIELDS.SIGN_IN.map((field) => {
          const Icon = iconMap[field.icon];
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

      <div className="text-right">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="w-full h-10" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Continue with Email'
        )}
      </Button>
    </form>
  );
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
