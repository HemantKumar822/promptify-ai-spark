
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
    node?: unknown; // Add the missing node property
  };

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;
  
  return (
    <div className={cn("markdown-content prose prose-sm dark:prose-invert max-w-none break-words", className)}>
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
                inline ? "bg-muted px-1 py-0.5 rounded" : "block bg-muted p-2 rounded overflow-x-auto", 
                className
              )} 
              {...props}
            >
              {children}
            </code>
          ),
          // Improve paragraph rendering
          p: ({ node, ...props }) => (
            <p className="my-2 break-words" {...props} />
          ),
          // Make headers more mobile-friendly
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold my-3 break-words" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold my-2 break-words" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold my-2 break-words" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
