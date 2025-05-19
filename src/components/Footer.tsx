
import React from 'react';

export function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        Powered by OpenRouter | Built by Hemant Kumar
      </p>
      <p className="mt-1 text-xs">
        © {new Date().getFullYear()} Promptify | v1.0.0 Beta
      </p>
    </footer>
  );
}
