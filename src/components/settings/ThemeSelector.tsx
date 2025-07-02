
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  value: Theme;
  onChange: (value: Theme) => void;
}

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-5 w-5" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-5 w-5" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-5 w-5" /> },
];

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent/50',
            value === option.value
              ? 'border-primary bg-accent/50 ring-1 ring-primary/20'
              : 'border-border bg-background'
          )}
        >
          {option.icon}
          <span className="text-xs font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
