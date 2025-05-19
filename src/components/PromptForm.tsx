
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

export function PromptForm() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUsingMarkdown, setIsUsingMarkdown] = useState(true);
  
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
          isImageMode ? "Image mode disabled" : "Image mode enabled"
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await enhancePrompt(inputPrompt, isImageMode);
      
      if (response.error) {
        console.error(response.error);
        toast.error("Failed to enhance prompt. Please try again.");
      } else {
        const enhancedText = response.enhancedPrompt;
        setEnhancedPrompt(enhancedText);
        
        // Add to prompt history
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
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("An error occurred. Please try again.");
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
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="inputPrompt" className="text-sm font-medium">
            Your Original Prompt {isImageMode && <span className="text-primary text-xs">(Image Mode)</span>}
          </label>
          <div className="flex gap-2">
            <SavedPrompts onSelectPrompt={setInputPrompt} />
            <PromptHistory onSelectPrompt={setInputPrompt} />
            <RandomPrompt onSelectPrompt={setInputPrompt} isImageMode={isImageMode} />
          </div>
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
            "px-8 py-6 text-base promptify-gradient hover:opacity-90 transition-opacity",
            isLoading ? "" : "animate-pulse-subtle",
            isImageMode && "from-purple-600 to-indigo-600"
          )}
          disabled={!inputPrompt.trim() || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Enhancing...
            </span>
          ) : (
            <>
              {isImageMode 
                ? "✨ Enhance Image Prompt" 
                : "✨ Enhance Prompt"}
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="enhancedPrompt" className="text-sm font-medium">
            Enhanced Prompt {isImageMode && <span className="text-primary text-xs">(Image Optimized)</span>}
          </label>
          {enhancedPrompt && (
            <div className="flex items-center gap-1">
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
            className="resize-none min-h-[180px] bg-accent prompt-shadow"
          />
        ) : (
          <div className="resize-none min-h-[180px] bg-accent prompt-shadow rounded-md p-3 overflow-auto">
            <MarkdownRenderer content={enhancedPrompt} />
          </div>
        )}
      </div>
    </form>
  );
}
