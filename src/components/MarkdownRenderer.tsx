
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Add proper types for the ReactMarkdown components
type CodeProps = React.ClassAttributes<HTMLElement> & 
  React.HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    className?: string;
  };

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;
  
  return (
    <div className={cn("markdown-content prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
        components={{
          // Enhance link components to open in new tab
          a: ({ node, ...props }) => (
            <a 
              {...props} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            />
          ),
          // Ensure code blocks render properly with proper typing
          code: ({ node, inline, className, children, ...props }: CodeProps) => (
            <code 
              className={cn(
                "font-mono text-sm", 
                inline ? "bg-muted px-1 py-0.5 rounded" : "block bg-muted p-2 rounded", 
                className
              )} 
              {...props}
            >
              {children}
            </code>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
