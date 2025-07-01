import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

interface SocialAuthProps {
  loading: boolean;
  onGoogleSignIn: () => void;
}

export const SocialAuth: React.FC<SocialAuthProps> = ({ loading, onGoogleSignIn }) => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background px-3 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <Button 
        variant="outline" 
        type="button" 
        className="w-full h-11 mt-6 border-muted-foreground/30 hover:bg-muted/50 hover:border-muted-foreground/50 transition-colors"
        onClick={onGoogleSignIn}
        disabled={loading}
      >
        <Chrome className="h-4 w-4 mr-3" />
        <span className="text-base font-medium">Continue with Google</span>
      </Button>
    </div>
  );
};
