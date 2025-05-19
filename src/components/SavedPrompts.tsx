
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Copy, Trash2 } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface SavedPrompt {
  id: string;
  text: string;
  isImagePrompt: boolean;
  createdAt: string;
}

interface SavedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SavedPrompts({ onSelectPrompt }: SavedPromptsProps) {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedPrompts = localStorage.getItem('promptify-saved-prompts');
    if (storedPrompts) {
      setSavedPrompts(JSON.parse(storedPrompts));
    }
  }, [open]);

  const deletePrompt = (id: string) => {
    const updatedPrompts = savedPrompts.filter(prompt => prompt.id !== id);
    localStorage.setItem('promptify-saved-prompts', JSON.stringify(updatedPrompts));
    setSavedPrompts(updatedPrompts);
    toast.success("Prompt deleted successfully");
  };

  const handleSelectPrompt = (prompt: SavedPrompt) => {
    onSelectPrompt(prompt.text);
    setOpen(false);
    toast.success("Prompt loaded successfully");
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
          Saved Prompts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Your Saved Prompts</DialogTitle>
        </DialogHeader>
        {savedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Star className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No saved prompts yet</p>
            <p className="text-xs text-muted-foreground">
              Click the star icon on any enhanced prompt to save it here
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {savedPrompts.map((prompt) => (
              <div 
                key={prompt.id} 
                className={cn(
                  "border rounded-md p-3 relative group hover:border-primary/30 transition-all",
                  prompt.isImagePrompt && "border-l-4 border-l-purple-500"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {prompt.isImagePrompt && (
                      <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        Image
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CopyButton 
                      text={prompt.text}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deletePrompt(prompt.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm line-clamp-3">{prompt.text}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-xs h-7"
                  onClick={() => handleSelectPrompt(prompt)}
                >
                  Use This Prompt
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
