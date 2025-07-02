import React from 'react';
import { SettingsSectionProps } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SettingsSection({ 
  title, 
  description, 
  children, 
  className = '' 
}: SettingsSectionProps) {
  return (
    <Card className={cn("w-full transition-all hover:shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// Utility function for consistent spacing
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
