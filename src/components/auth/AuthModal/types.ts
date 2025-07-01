export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
}

export interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

export interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  formData: AuthFormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignUp?: boolean;
  errors?: Record<string, string>;
}
