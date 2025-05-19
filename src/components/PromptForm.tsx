
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { enhancePrompt } from '@/services/api';
import { CopyButton } from '@/components/CopyButton';

export function PromptForm() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await enhancePrompt(inputPrompt);
      
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="inputPrompt" className="text-sm font-medium">
            Your Original Prompt
          </label>
          {inputPrompt && (
            <CopyButton text={inputPrompt} />
          )}
        </div>
        <Textarea
          id="inputPrompt"
          placeholder="Enter your prompt here..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="resize-none min-h-[180px] prompt-shadow focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      </div>
      
      <div className="flex justify-center">
        <Button
          type="submit"
          className="px-8 py-6 text-base promptify-gradient hover:opacity-90 transition-opacity animate-pulse-subtle"
          disabled={!inputPrompt.trim() || isLoading}
        >
          {isLoading ? "Enhancing..." : "✨ Enhance Prompt"}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="enhancedPrompt" className="text-sm font-medium">
            Enhanced Prompt
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
