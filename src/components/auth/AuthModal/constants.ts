export type IconName = 'mail' | 'lock' | 'user';

export interface FormFieldConfig {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: IconName;
  autoComplete: string;
  required: boolean;
}

export const AUTH_FORM_FIELDS: {
  SIGN_IN: FormFieldConfig[];
  SIGN_UP: FormFieldConfig[];
} = {
  SIGN_IN: [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      icon: 'mail',
      autoComplete: 'email',
      required: true,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      icon: 'lock',
      autoComplete: 'current-password',
      required: true,
    },
  ],
  SIGN_UP: [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: 'user',
      autoComplete: 'name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      icon: 'mail',
      autoComplete: 'email',
      required: true,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a password',
      icon: 'lock',
      autoComplete: 'new-password',
      required: true,
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      icon: 'lock',
      autoComplete: 'new-password',
      required: true,
    },
  ],
} as const;

export const AUTH_TABS = [
  { value: 'signin', label: 'Sign In' },
  { value: 'signup', label: 'Sign Up' },
] as const;
