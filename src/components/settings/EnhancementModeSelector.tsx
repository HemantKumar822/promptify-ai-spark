import React from 'react';
import { Card } from '@/components/ui/card';
import { EnhancementMode, EnhancementOption } from './types';
import { cn } from '@/lib/utils';
import { Sparkles, PenTool, BookOpen, Code, Megaphone, BookOpenText, Gauge } from 'lucide-react';

const enhancementOptions: EnhancementOption[] = [
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'A good mix of creativity and structure',
    icon: <Gauge className="h-5 w-5" />,
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-appropriate tone',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Imaginative and original content',
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    value: 'academic',
    label: 'Academic',
    description: 'Formal and research-oriented',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    value: 'technical',
    label: 'Technical',
    description: 'Precise and detailed explanations',
    icon: <Code className="h-5 w-5" />,
  },
  {
    value: 'marketing',
    label: 'Marketing',
    description: 'Persuasive and engaging content',
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    value: 'storytelling',
    label: 'Storytelling',
    description: 'Narrative and descriptive style',
    icon: <BookOpenText className="h-5 w-5" />,
  },
];

interface EnhancementModeSelectorProps {
  value: EnhancementMode;
  onChange: (value: EnhancementMode) => void;
  className?: string;
}

export function EnhancementModeSelector({ 
  value, 
  onChange,
  className = '' 
}: EnhancementModeSelectorProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", className)}>
      {enhancementOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "text-left p-4 rounded-lg border transition-all hover:border-primary hover:bg-accent/50",
            value === option.value 
              ? "border-primary bg-accent/50 ring-1 ring-primary/20" 
              : "border-border bg-background"
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              {React.cloneElement(option.icon as React.ReactElement, {
                className: "h-4 w-4"
              })}
            </div>
            <div>
              <h4 className="font-medium text-sm">{option.label}</h4>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
