
import React from 'react';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type EnhancementMode = "professional" | "creative" | "academic" | "technical" | "marketing" | "storytelling";

interface StyleSelectorProps {
  value: EnhancementMode;
  onChange: (value: EnhancementMode) => void;
  disabled?: boolean;
}

export function StyleSelector({ value, onChange, disabled = false }: StyleSelectorProps) {
  const styles: { value: EnhancementMode; label: string; color: string }[] = [
    { value: "professional", label: "Professional", color: "bg-blue-500" },
    { value: "creative", label: "Creative", color: "bg-purple-500" },
    { value: "academic", label: "Academic", color: "bg-green-500" },
    { value: "technical", label: "Technical", color: "bg-gray-500" },
    { value: "marketing", label: "Marketing", color: "bg-pink-500" },
    { value: "storytelling", label: "Storytelling", color: "bg-amber-500" }
  ];
  
  const currentStyle = styles.find(s => s.value === value) || styles[0];
  
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger 
            disabled={disabled}
            className={cn(
              "p-1.5 rounded-md transition-all flex items-center justify-center", 
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent text-muted-foreground hover:text-foreground",
              value && !disabled && "text-primary"
            )}
          >
            <div className="relative">
              <Palette className="h-4 w-4" />
              <div 
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-background",
                  currentStyle.color
                )}
              />
            </div>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Select enhancement style</p>
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenuContent align="end" className="w-48">
        {styles.map((style) => (
          <DropdownMenuItem
            key={style.value}
            className="flex items-center gap-2 capitalize"
            onClick={() => onChange(style.value)}
          >
            <div className={cn("w-2 h-2 rounded-full", style.color)} />
            {style.label}
            {value === style.value && (
              <span className="ml-auto text-xs text-primary">Selected</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
