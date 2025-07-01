import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        Powered by OpenRouter | Built by Hemant Kumar
      </p>
      <div className="mt-1 text-xs flex justify-center items-center gap-x-2">
        <span>© {new Date().getFullYear()} Promptify</span>
        <span className="text-muted-foreground/50">|</span>
        <Link to="/privacy" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <span className="text-muted-foreground/50">|</span>
        <span>v1.0.0 Beta</span>
      </div>
    </footer>
  );
}
