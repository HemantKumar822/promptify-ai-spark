
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { enhancePrompt } from '@/services/api';
import { CopyButton } from '@/components/CopyButton';
import { Image, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { SharePrompt } from '@/components/SharePrompt';
import { SavedPrompts, SavedPrompt } from '@/components/SavedPrompts';
import { PromptHistory, HistoryPrompt } from '@/components/PromptHistory';
import { RandomPrompt } from '@/components/RandomPrompt';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { StyleSelector } from '@/components/StyleSelector';
import { ApiKeyNotice } from '@/components/ApiKeyNotice';
import { useAuth } from '@/hooks/useAuth';
import { useUserSettings, EnhancementMode } from '@/hooks/useUserSettings';
import { supabase } from '@/lib/supabase';

interface PromptFormProps {
  onOpenSettings?: () => void
  onOpenAuth?: () => void
}

export function PromptForm({ onOpenSettings, onOpenAuth }: PromptFormProps) {
  const { user, profile } = useAuth()
  const { settings, updateSettings } = useUserSettings()
  
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUsingMarkdown, setIsUsingMarkdown] = useState(true);
  const [enhancementMode, setEnhancementMode] = useState<EnhancementMode>(settings.defaultEnhancementMode);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Check API key availability
  const checkApiKey = async () => {
    try {
      // Check user account first
      if (user && profile?.api_key_encrypted) {
        setHasApiKey(true)
        return
      }
      
      // Check localStorage
      const localKey = localStorage.getItem('openrouter-api-key')
      setHasApiKey(!!localKey && localKey.trim() !== '')
    } catch (error) {
      setHasApiKey(false)
    }
  }

  // Update enhancement mode when settings change
  useEffect(() => {
    setEnhancementMode(settings.defaultEnhancementMode)
  }, [settings.defaultEnhancementMode])

  // Check API key on mount and when user/profile changes
  useEffect(() => {
    checkApiKey()
  }, [user, profile])

  // Check if the current prompt is saved
  useEffect(() => {
    if (!enhancedPrompt) {
      setIsSaved(false);
      return;
    }
    
    const savedPrompts: SavedPrompt[] = JSON.parse(
      localStorage.getItem('promptify-saved-prompts') || '[]'
    );
    
    const promptExists = savedPrompts.some(p => p.text === enhancedPrompt);
    setIsSaved(promptExists);
  }, [enhancedPrompt]);
  
  // Add keyboard shortcut for toggling image mode (Ctrl+I or Cmd+I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        setIsImageMode(prev => !prev);
        toast.success(
          isImageMode ? "Regular prompt mode" : "Image prompt mode enabled"
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputPrompt.trim()) return;
    
    // Check if user has API key
    if (!hasApiKey) {
      toast.error("🔑 Please add your OpenRouter API key first!", {
        description: user ? "Go to Settings → API Keys" : "Sign in to save your API key securely",
        action: {
          label: user ? "Open Settings" : "Sign In",
          onClick: user ? onOpenSettings : onOpenAuth
        }
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Pass the enhancement mode to the API
      const response = await enhancePrompt(inputPrompt, isImageMode, enhancementMode);
      
      if (response.error) {
        console.error(response.error);
        toast.error("Failed to enhance prompt. Please try again.");
      } else {
        const enhancedText = response.enhancedPrompt;
        setEnhancedPrompt(enhancedText);
        
        // Save to database if user is signed in
        if (user && settings.autoSaveHistory) {
          try {
            await supabase.from('user_prompts').insert({
              user_id: user.id,
              input_prompt: inputPrompt,
              enhanced_prompt: enhancedText,
              is_image_prompt: isImageMode,
              enhancement_mode: enhancementMode,
              is_saved: false
            });
          } catch (error) {
            console.warn('Failed to save to database:', error);
          }
        }
        
        // Add to local history as fallback
        const newHistoryItem: HistoryPrompt = {
          id: uuidv4(),
          inputPrompt,
          enhancedPrompt: enhancedText,
          isImagePrompt: isImageMode,
          timestamp: new Date().toISOString()
        };
        
        const history = JSON.parse(localStorage.getItem('promptify-history') || '[]');
        const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Keep only last 10
        localStorage.setItem('promptify-history', JSON.stringify(updatedHistory));
        
        // Update user's default mode if they've changed it
        if (enhancementMode !== settings.defaultEnhancementMode) {
          await updateSettings({ defaultEnhancementMode: enhancementMode });
        }
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleImageMode = () => {
    setIsImageMode(prev => !prev);
    toast.success(
      isImageMode ? "Regular prompt mode" : "Image prompt mode enabled"
    );
  };
  
  const savePrompt = (e: React.MouseEvent) => {
    // Prevent event propagation to avoid any form submission
    e.preventDefault();
    e.stopPropagation();
    
    if (!enhancedPrompt) return;
    
    const newSavedPrompt: SavedPrompt = {
      id: uuidv4(),
      text: enhancedPrompt,
      isImagePrompt: isImageMode,
      createdAt: new Date().toISOString()
    };
    
    const savedPrompts = JSON.parse(localStorage.getItem('promptify-saved-prompts') || '[]');
    
    // Check if already saved
    if (savedPrompts.some(p => p.text === enhancedPrompt)) {
      toast.error("This prompt is already saved!");
      return;
    }
    
    const updatedSavedPrompts = [newSavedPrompt, ...savedPrompts];
    localStorage.setItem('promptify-saved-prompts', JSON.stringify(updatedSavedPrompts));
    
    setIsSaved(true);
    toast.success("Prompt saved to your collection!");
  };
  
  // Reset enhancement mode when switching to image mode
  useEffect(() => {
    if (isImageMode) {
      // Reset to professional if switching to image mode
      setEnhancementMode("professional");
    }
  }, [isImageMode]);
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* API Key Notice */}
      {!hasApiKey && (
        <ApiKeyNotice onOpenSettings={onOpenSettings} onOpenAuth={onOpenAuth} />
      )}
      
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <label htmlFor="inputPrompt" className="text-sm font-medium">
            Your Original Prompt {isImageMode && <span className="text-primary text-xs">(Image Mode)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            <SavedPrompts onSelectPrompt={setInputPrompt} />
            <PromptHistory onSelectPrompt={setInputPrompt} />
            <RandomPrompt 
              onSelectPrompt={setInputPrompt} 
              isImageMode={isImageMode} 
              enhancementMode={enhancementMode} 
            />
          </div>
        </div>
        <div className="relative">
          <Textarea
            id="inputPrompt"
            placeholder={isImageMode ? "Enter your image prompt here..." : "Enter your prompt here..."}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="resize-none min-h-[140px] sm:min-h-[180px] prompt-shadow focus-visible:ring-2 focus-visible:ring-primary/50 pr-10 text-sm sm:text-base"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  type="button"
                  onClick={toggleImageMode}
                  className={cn(
                    "p-1.5 rounded-md transition-all", 
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

            {/* Integrate the Style Selector next to the Image mode toggle */}
            {!isImageMode && (
              <StyleSelector 
                value={enhancementMode}
                onChange={setEnhancementMode}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          type="submit"
          className={cn(
            "px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base promptify-gradient hover:opacity-90 transition-opacity w-full sm:w-auto",
            isLoading ? "" : "animate-pulse-subtle",
            isImageMode && "from-purple-600 to-indigo-600",
            !hasApiKey && "opacity-50 cursor-not-allowed"
          )}
          disabled={!inputPrompt.trim() || isLoading || !hasApiKey}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Enhancing...
            </span>
          ) : !hasApiKey ? (
            <span className="flex items-center gap-2">
              🔑 API Key Required
            </span>
          ) : (
            <>
              {isImageMode 
                ? "✨ Enhance Image Prompt" 
                : `✨ Enhance ${enhancementMode.charAt(0).toUpperCase() + enhancementMode.slice(1)} Prompt`}
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <label htmlFor="enhancedPrompt" className="text-sm font-medium">
            Enhanced Prompt {isImageMode && <span className="text-primary text-xs">(Image Optimized)</span>}
            {!isImageMode && <span className="text-primary text-xs capitalize ml-1">({enhancementMode})</span>}
          </label>
          {enhancedPrompt && (
            <div className="flex flex-wrap items-center gap-1">
              <CopyButton text={enhancedPrompt} />
              <SharePrompt prompt={enhancedPrompt} isImagePrompt={isImageMode} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={savePrompt}
                    disabled={isSaved}
                  >
                    <Star
                      className={cn("h-4 w-4", isSaved && "fill-primary text-primary")}
                    />
                    <span className="sr-only">
                      {isSaved ? "Saved to collection" : "Save prompt"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{isSaved ? "Already saved" : "Save to your collection"}</p>
                </TooltipContent>
              </Tooltip>
              {!isImageMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsUsingMarkdown(!isUsingMarkdown);
                      }}
                    >
                      <span className={cn(
                        "font-mono text-xs font-bold",
                        isUsingMarkdown && "text-primary"
                      )}>
                        MD
                      </span>
                      <span className="sr-only">
                        {isUsingMarkdown ? "View plain text" : "View with markdown"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{isUsingMarkdown ? "View as plain text" : "View with markdown formatting"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
        
        {isImageMode || !isUsingMarkdown || !enhancedPrompt ? (
          <Textarea
            id="enhancedPrompt"
            placeholder="Your enhanced prompt will appear here..."
            value={enhancedPrompt}
            readOnly
            className="resize-none min-h-[140px] sm:min-h-[180px] bg-accent prompt-shadow text-sm sm:text-base"
          />
        ) : (
          <div className="resize-none min-h-[140px] sm:min-h-[180px] bg-accent prompt-shadow rounded-md p-3 overflow-auto">
            <MarkdownRenderer content={enhancedPrompt} />
          </div>
        )}
      </div>
    </form>
  );
}
