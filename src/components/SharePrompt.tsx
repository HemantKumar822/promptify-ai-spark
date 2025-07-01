
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { CopyButton } from './CopyButton';

interface SharePromptProps {
  prompt: string;
  isImagePrompt: boolean;
  trigger?: React.ReactNode;
}

export function SharePrompt({ prompt, isImagePrompt, trigger }: SharePromptProps) {
  const [isOpen, setIsOpen] = useState(false);

  const generateShareableText = () => {
    const modeText = isImagePrompt ? "Image Prompt" : "Text Prompt";
    return `${modeText} created with Promptify:\n\n${prompt}`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    // Prevent event propagation to avoid triggering parent events
    e.stopPropagation();
    
    if (!prompt) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Promptify - Enhanced Prompt',
          text: generateShareableText(),
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log("Share operation failed:", error);
          toast.error("Failed to share. Please try again.");
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      setIsOpen(true);
    }
  };

  if (!prompt) return null;

  const shareButton = trigger ? (
    React.cloneElement(trigger as React.ReactElement, {
      onClick: (e: React.MouseEvent) => {
        handleShare(e);
        // Call the original onClick if it exists
        if ((trigger as React.ReactElement).props.onClick) {
          (trigger as React.ReactElement).props.onClick(e);
        }
      }
    })
  ) : (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={handleShare}
      disabled={!prompt}
      type="button"
    >
      <Share className="h-4 w-4" />
      <span className="sr-only">Share prompt</span>
    </Button>
  );

  return (
    <>
      {shareButton}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Copy this text to share your enhanced prompt:
            </p>
            <div className="flex items-center space-x-2">
              <Input 
                value={generateShareableText()} 
                readOnly 
                className="flex-1"
              />
              <CopyButton text={generateShareableText()} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
