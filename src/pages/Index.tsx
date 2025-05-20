
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
        <header className="py-3 sm:py-4 px-4 sm:px-6 border-b">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <Logo />
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
            <div className="text-center space-y-3 mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl animate-fade-in">
                AI Prompt Engineer
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                Transform basic prompts into powerful, context-rich instructions optimized for any AI model or image generator.
              </p>
              <div className="pt-1 max-w-2xl mx-auto">
                <p className="text-sm text-muted-foreground animate-fade-in-delayed">
                  Choose from professional, creative, academic, technical, marketing, or storytelling styles for text prompts,
                  or use our specialized image prompt mode for stunning AI art generation.
                </p>
              </div>
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
