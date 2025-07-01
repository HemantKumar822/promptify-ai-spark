import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { getSavedPrompts, unsavePrompt, SavedPromptDb } from '@/services/api';
import { cn } from '@/lib/utils';

interface SavedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SavedPrompts({ onSelectPrompt }: SavedPromptsProps) {
  const { user } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState<SavedPromptDb[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchSavedPrompts = useCallback(async () => {
    if (!user) {
      setSavedPrompts([]);
      return;
    }
    setLoading(true);
    try {
      const prompts = await getSavedPrompts(user.id);
      setSavedPrompts(prompts);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchSavedPrompts();
    }
  }, [open, fetchSavedPrompts]);

  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt(prompt);
    setOpen(false);
  };

  const handleUnsave = async (e: React.MouseEvent, promptText: string) => {
    e.stopPropagation();
    if (!user) return;
    await unsavePrompt(promptText, user.id);
    setSavedPrompts(prev => prev.filter(p => p.text !== promptText));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
        >
          <Star className="h-3.5 w-3.5" />
          Saved
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Your Saved Prompts</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : savedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Star className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              {user ? 'You have no saved prompts' : 'Please log in to see your saved prompts'}
            </p>
            <p className="text-xs text-muted-foreground">
              Click the star icon on an enhanced prompt to save it here
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {savedPrompts.map((item) => (
              <div
                key={item.id}
                className="border rounded-md p-3 group relative hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => handleSelectPrompt(item.text)}
              >
                <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        item.is_image_prompt ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {item.is_image_prompt ? "Image Prompt" : "Text Prompt"}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleUnsave(e, item.text)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
                <p className="text-sm line-clamp-3">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
