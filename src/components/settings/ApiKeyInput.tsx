import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => Promise<boolean>;
  onSave: () => Promise<void>;
  isTesting: boolean;
  isValid: boolean | null;
  showKey: boolean;
  onToggleVisibility: () => void;
  isSaving: boolean;
}

export function ApiKeyInput({
  value,
  onChange,
  onValidate,
  onSave,
  isTesting,
  isValid,
  showKey,
  onToggleVisibility,
  isSaving,
}: ApiKeyInputProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="sk-or-..."
          className={cn(
            'pr-24',
            isValid === true && 'border-green-500 dark:border-green-600',
            isValid === false && 'border-red-500 dark:border-red-600'
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
            className="h-8 w-8"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onValidate}
            disabled={!value.trim() || isTesting}
            className="h-8"
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isValid === true ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : isValid === false ? (
              <X className="h-4 w-4 text-red-500" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving || !value.trim() || isValid === false}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save API Key'
          )}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Your API key is encrypted and stored securely. It's only used to communicate with OpenRouter.
      </p>
    </div>
  );
}
