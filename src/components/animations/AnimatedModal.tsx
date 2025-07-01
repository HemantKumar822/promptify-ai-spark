import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
}

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true,
}: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
              overlayClassName
            )}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className={cn(
                'bg-background rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || onClose) && (
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
                  {title && (
                    <h2 className="text-lg font-semibold">{title}</h2>
                  )}
                  {onClose && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onClose}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-4">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
