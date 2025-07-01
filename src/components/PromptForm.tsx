import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  enhancePrompt,
  getApiKey,
  savePromptToHistory,
  getSavedPrompts,
  savePrompt,
  unsavePrompt,
  SavedPromptDb,
} from '@/services/api';
import { CopyButton } from '@/components/CopyButton';
import { Image, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { SharePrompt } from '@/components/SharePrompt';
import { SavedPrompts } from '@/components/SavedPrompts';
import { PromptHistory } from '@/components/PromptHistory';
import { RandomPrompt } from '@/components/RandomPrompt';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { StyleSelector } from '@/components/StyleSelector';

import { useAuth } from '@/hooks/useAuth';
import { useUserSettings, EnhancementMode } from '@/hooks/useUserSettings';
import { supabase } from '@/lib/supabase';

interface PromptFormProps {
  onOpenSettings?: () => void
  onOpenAuth?: () => void
  refreshTrigger?: number // Add this to force refresh when settings change
}

export function PromptForm({ onOpenSettings, onOpenAuth, refreshTrigger }: PromptFormProps) {
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
  const [savedPrompts, setSavedPrompts] = useState<SavedPromptDb[]>([]);
  
  // Check API key availability
  const checkApiKey = async () => {
    if (!user) {
      setHasApiKey(false);
      return;
    }
    try {
      const key = await getApiKey(user);
      const keyExists = !!key;
      setHasApiKey(keyExists);
      console.log('PromptForm: API key check result:', keyExists);
    } catch (error) {
      console.error('PromptForm: Error checking API key:', error);
      setHasApiKey(false);
    }
  };

  // Update enhancement mode when settings change
  useEffect(() => {
    setEnhancementMode(settings.defaultEnhancementMode)
  }, [settings.defaultEnhancementMode])

  // Check API key on mount and when user/profile changes, and fetch saved prompts
  useEffect(() => {
    checkApiKey();
    if (user) {
      getSavedPrompts(user.id).then(setSavedPrompts);
    } else {
      setSavedPrompts([]);
    }
  }, [user, profile, refreshTrigger]);

  // Check if the current prompt is saved
  useEffect(() => {
    if (!enhancedPrompt) {
      setIsSaved(false);
      return;
    }
    const promptExists = savedPrompts.some(p => p.text === enhancedPrompt);
    setIsSaved(promptExists);
  }, [enhancedPrompt, savedPrompts]);
  
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
      const response = await enhancePrompt(inputPrompt, user, isImageMode, enhancementMode);
      
      if (response.error) {
        console.error(response.error);
        toast.error("Failed to enhance prompt. Please try again.");
      } else {
        const enhancedText = response.enhancedPrompt;
        setEnhancedPrompt(enhancedText);
        
        // Save to database if user is signed in. The `enhancePrompt` function now handles this.
        
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
  
  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !enhancedPrompt) {
      toast.info(user ? 'Please enhance a prompt first.' : 'Please log in to save prompts.');
      return;
    }

    if (isSaved) {
      // Unsave the prompt
      await unsavePrompt(enhancedPrompt, user.id);
      setSavedPrompts(prev => prev.filter(p => p.text !== enhancedPrompt));
    } else {
      // Save the prompt
      const newSavedPrompt = await savePrompt({
        user_id: user.id,
        text: enhancedPrompt,
        is_image_prompt: isImageMode,
      });
      if (newSavedPrompt) {
        setSavedPrompts(prev => [newSavedPrompt, ...prev]);
      }
    }
  };
  
  const toggleImageMode = () => {
    setIsImageMode(prev => !prev);
    toast.success(
      isImageMode ? "Regular prompt mode" : "Image prompt mode enabled"
    );
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
      {/* API Key Notice - Subtle and clean */}
      {!hasApiKey && (
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 bg-muted/50 px-3 py-1.5 rounded-full text-xs">
              <span className="text-blue-500">🔑</span>
              <span>Requires </span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://openrouter.ai/keys', '_blank');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                OpenRouter API key
              </button>
              <span> • </span>
              {user ? (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenSettings?.();
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Add key
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAuth?.();
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign in
                </button>
              )}
            </span>
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <label htmlFor="inputPrompt" className="text-sm font-medium">
            Your Original Prompt {isImageMode && <span className="text-primary text-xs">(Image Mode)</span>}
          </label>
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
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
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  type="button"
                  onClick={toggleImageMode}
                  className={cn(
                    "p-2 rounded-md transition-all", 
                    isImageMode 
                      ? "bg-primary/10 text-primary ring-2 ring-primary/50" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  aria-label="Toggle image prompt mode"
                >
                  <Image size={18} />
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
        <label htmlFor="enhancedPrompt" className="text-sm font-medium block">
          Enhanced Prompt {isImageMode && <span className="text-primary text-xs">(Image Optimized)</span>}
          {!isImageMode && <span className="text-primary text-xs capitalize ml-1">({enhancementMode})</span>}
        </label>
        
        <div className="relative group">
          {isImageMode || !isUsingMarkdown || !enhancedPrompt ? (
            <Textarea
              id="enhancedPrompt"
              placeholder="Your enhanced prompt will appear here..."
              value={enhancedPrompt}
              readOnly
              className="resize-none min-h-[140px] sm:min-h-[180px] bg-accent prompt-shadow text-sm sm:text-base pr-16"
            />
          ) : (
            <div className="resize-none min-h-[140px] sm:min-h-[180px] bg-accent prompt-shadow rounded-md p-4 pr-16 overflow-auto">
              <MarkdownRenderer content={enhancedPrompt} />
            </div>
          )}
          
          {enhancedPrompt && (
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveToggle}
                    className="h-8 w-8 hover:bg-transparent"
                  >
                    <Star className={cn("h-4 w-4", isSaved ? "text-yellow-400 fill-yellow-400" : "text-foreground/40")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{isSaved ? 'Unsave Prompt' : 'Save Prompt'}</TooltipContent>
              </Tooltip>
              
              <SharePrompt 
                prompt={enhancedPrompt} 
                isImagePrompt={isImageMode} 
                trigger={
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" x2="12" y1="2" y2="15"/>
                    </svg>
                  </Button>
                }
              />
              
              <CopyButton 
                text={enhancedPrompt} 
                trigger={
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                  </Button>
                }
              />
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
