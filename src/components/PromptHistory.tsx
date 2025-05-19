
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Copy } from 'lucide-react';
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

export interface HistoryPrompt {
  id: string;
  inputPrompt: string;
  enhancedPrompt: string;
  isImagePrompt: boolean;
  timestamp: string;
}

interface PromptHistoryProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const [promptHistory, setPromptHistory] = useState<HistoryPrompt[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const history = localStorage.getItem('promptify-history');
    if (history) {
      setPromptHistory(JSON.parse(history));
    }
  }, [open]);

  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt(prompt);
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
          <Clock className="h-3.5 w-3.5" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Your Prompt History</DialogTitle>
        </DialogHeader>
        {promptHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No prompt history yet</p>
            <p className="text-xs text-muted-foreground">
              Your recent prompts will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {promptHistory.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "border rounded-md p-3 relative group hover:border-primary/30 transition-all",
                  item.isImagePrompt && "border-l-4 border-l-purple-500"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {item.isImagePrompt && (
                      <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        Image
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CopyButton 
                      text={item.enhancedPrompt}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 mb-1">Original:</p>
                <p className="text-xs line-clamp-1 mb-2">{item.inputPrompt}</p>
                <p className="text-xs text-muted-foreground mb-1">Enhanced:</p>
                <p className="text-sm line-clamp-3">{item.enhancedPrompt}</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-xs h-7"
                    onClick={() => handleSelectPrompt(item.inputPrompt)}
                  >
                    Use Input
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs h-7"
                    onClick={() => handleSelectPrompt(item.enhancedPrompt)}
                  >
                    Use Enhanced
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
