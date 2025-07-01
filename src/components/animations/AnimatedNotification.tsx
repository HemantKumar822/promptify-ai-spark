import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface AnimatedNotificationProps {
  message: string;
  type?: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const typeStyles = {
  success: 'bg-green-100 border-green-400 text-green-800',
  error: 'bg-red-100 border-red-400 text-red-800',
  info: 'bg-blue-100 border-blue-400 text-blue-800',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '!',
};

export function AnimatedNotification({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
  className = '',
}: AnimatedNotificationProps) {
  // Auto-close after duration
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm',
            typeStyles[type],
            className
          )}
        >
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/50 font-bold">
            {typeIcons[type]}
          </div>
          <div className="flex-1 text-sm">{message}</div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-current hover:bg-black/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
