import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/lib/theme-provider';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PromptForm } from '@/components/PromptForm';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/auth/UserMenu';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  const handleSignInClick = () => {
    setIsSigningIn(true);
    setShowAuthModal(true);
  };
  
  // Reset loading state when auth modal closes
  useEffect(() => {
    if (!showAuthModal) {
      // Small delay to allow any animations to complete
      const timer = setTimeout(() => setIsSigningIn(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showAuthModal]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <header className="py-3 sm:py-4 px-4 sm:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {loading ? (
                <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
              ) : user ? (
                <UserMenu 
                  onOpenSettings={() => setShowSettingsModal(true)} 
                  className="relative z-50"
                />
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignInClick}
                    disabled={isSigningIn}
                    className="h-9 px-4 rounded-md text-sm font-medium"
                    aria-label="Sign In"
                    aria-busy={isSigningIn}
                  >
                    {isSigningIn ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Sign in
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
            <div className="text-center space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl animate-fade-in">
                AI Prompt Engineer
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                Transform basic prompts into powerful, context-rich instructions optimized for any AI model.
              </p>
            </div>
            
            <div className="animate-scale-in">
              <PromptForm 
                onOpenSettings={() => setShowSettingsModal(true)}
                onOpenAuth={() => setShowAuthModal(true)}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Modals */}
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        <SettingsModal 
          open={showSettingsModal} 
          onOpenChange={(open) => {
            setShowSettingsModal(open)
            if (!open) {
              // Trigger refresh when settings modal closes
              setRefreshTrigger(prev => prev + 1)
            }
          }} 
        />
        
        <CookieConsentBanner />
      </div>
    </ThemeProvider>
  );
};

export default Index;
