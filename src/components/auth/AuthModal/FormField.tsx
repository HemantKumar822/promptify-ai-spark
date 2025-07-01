import React from 'react';
import { Input } from '@/components/ui/input';

export interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
  error,
  autoComplete,
  required = false,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-muted-foreground">
            {icon}
          </span>
        </div>
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`pl-10 h-10 ${error ? 'border-destructive' : ''}`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
