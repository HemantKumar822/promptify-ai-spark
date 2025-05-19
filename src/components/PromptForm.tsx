
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { enhancePrompt } from '@/services/api';
import { CopyButton } from '@/components/CopyButton';
import { Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function PromptForm() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await enhancePrompt(inputPrompt, isImageMode);
      
      if (response.error) {
        console.error(response.error);
      } else {
        setEnhancedPrompt(response.enhancedPrompt);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImageMode = () => {
    setIsImageMode(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="inputPrompt" className="text-sm font-medium">
            Your Original Prompt {isImageMode && <span className="text-primary text-xs">(Image Mode)</span>}
          </label>
          {inputPrompt && (
            <CopyButton text={inputPrompt} />
          )}
        </div>
        <div className="relative">
          <Textarea
            id="inputPrompt"
            placeholder={isImageMode ? "Enter your image prompt here..." : "Enter your prompt here..."}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="resize-none min-h-[180px] prompt-shadow focus-visible:ring-2 focus-visible:ring-primary/50 pr-10"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button"
                onClick={toggleImageMode}
                className={cn(
                  "absolute bottom-3 left-3 p-1.5 rounded-md transition-all", 
                  isImageMode 
                    ? "bg-primary/10 text-primary ring-2 ring-primary/50" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                aria-label="Toggle image prompt mode"
              >
                <Image size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isImageMode ? "Disable" : "Enable"} image prompt mode</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          type="submit"
          className={cn(
            "px-8 py-6 text-base promptify-gradient hover:opacity-90 transition-opacity animate-pulse-subtle",
            isImageMode && "from-purple-600 to-indigo-600"
          )}
          disabled={!inputPrompt.trim() || isLoading}
        >
          {isLoading 
            ? "Enhancing..." 
            : isImageMode 
              ? "✨ Enhance Image Prompt" 
              : "✨ Enhance Prompt"
          }
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="enhancedPrompt" className="text-sm font-medium">
            Enhanced Prompt {isImageMode && <span className="text-primary text-xs">(Image Optimized)</span>}
          </label>
          {enhancedPrompt && (
            <CopyButton text={enhancedPrompt} />
          )}
        </div>
        <Textarea
          id="enhancedPrompt"
          placeholder="Your enhanced prompt will appear here..."
          value={enhancedPrompt}
          readOnly
          className="resize-none min-h-[180px] bg-accent prompt-shadow"
        />
      </div>
    </form>
  );
}
