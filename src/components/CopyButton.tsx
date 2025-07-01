
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
  trigger?: React.ReactElement;
}

export function CopyButton({ text, className, trigger }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy. Please try again.");
    }
  };

  // Animation variants
  const iconVariants = {
    initial: { scale: 1, opacity: 1 },
    animate: { 
      scale: [1, 1.2, 1], 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Base button with animation
  const baseButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 hover:bg-transparent", className)}
      onClick={handleCopy}
      disabled={!text}
      type="button"
    >
      <div className="relative h-4 w-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={iconVariants}
              className="absolute"
            >
              <Check className="h-4 w-4 text-green-500" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={iconVariants}
              className="absolute"
            >
              <Copy className="h-4 w-4 text-foreground/40" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Copy to clipboard</span>
      </div>
    </Button>
  );

  // If there's a custom trigger, clone it with our click handler
  if (trigger) {
    return React.cloneElement(trigger, {
      onClick: (e: React.MouseEvent) => {
        handleCopy(e);
        if (trigger.props.onClick) {
          trigger.props.onClick(e);
        }
      },
      children: (
        <div className="relative h-4 w-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={iconVariants}
                className="absolute"
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={iconVariants}
                className="absolute"
              >
                {trigger.props.children}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )
    });
  }

  return baseButton;
}
