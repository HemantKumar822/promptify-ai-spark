import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
}

export function AnimatedButton({
  children,
  className,
  hoverScale = 1.05,
  tapScale = 0.95,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      className="inline-block"
    >
      <Button
        className={cn("transition-transform duration-200", className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
