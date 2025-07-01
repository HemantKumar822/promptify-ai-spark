import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage to see if consent has already been given.
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // If no consent is found, show the banner.
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // When the user accepts, store the consent and hide the banner.
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[9999] bg-background/80 backdrop-blur-sm transition-all duration-500 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              We use essential cookies and local storage to make our site work. By using our site, you acknowledge that you have read and understand our{' '}
              <Link to="/privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button size="sm" onClick={handleAccept}>
              Accept & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 