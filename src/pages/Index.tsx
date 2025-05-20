
import React from 'react';
import { ThemeProvider } from '@/lib/theme-provider';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PromptForm } from '@/components/PromptForm';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <header className="py-3 sm:py-4 px-3 sm:px-6 border-b">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <Logo />
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 py-4 sm:py-8 px-3 sm:px-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-3 sm:gap-6">
            <div className="text-center space-y-2 sm:space-y-3 mb-2 sm:mb-6">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight md:text-4xl animate-fade-in">
                AI Prompt Engineer
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                Transform basic prompts into powerful, context-rich instructions optimized for any AI model.
              </p>
            </div>
            
            <div className="animate-scale-in">
              <PromptForm />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
