
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md promptify-gradient flex items-center justify-center">
        <span className="text-white font-bold text-lg">P</span>
      </div>
      <span className="font-bold text-xl flex items-center">
        Promptify
        <span className="text-xs ml-1 text-muted-foreground mt-1">Beta</span>
      </span>
    </div>
  );
}
