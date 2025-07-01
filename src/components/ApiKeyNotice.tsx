import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Key, ExternalLink, Info, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface ApiKeyNoticeProps {
  onOpenSettings?: () => void
  onOpenAuth?: () => void
}

export function ApiKeyNotice({ onOpenSettings, onOpenAuth }: ApiKeyNoticeProps) {
  const { user } = useAuth()

  return (
    <Alert className="p-4 sm:p-5 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 text-blue-800 dark:text-blue-300">
      <div className="flex items-start gap-4">
        <Key className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <AlertTitle className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
            Connect Your API Key
          </AlertTitle>
          <AlertDescription className="text-sm">
            Sign in to securely save your OpenRouter API key and start enhancing prompts.
          </AlertDescription>

          <div className="mt-4 flex flex-col gap-3">
            {user ? (
              <Button onClick={onOpenSettings} size="sm" className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700">
                <Key className="mr-2 h-4 w-4" />
                Add API Key in Settings
              </Button>
            ) : (
              <Button onClick={onOpenAuth} size="sm" className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Save API Key
              </Button>
            )}
            
            <Button 
              variant="link" 
              size="sm" 
              className="w-full sm:w-auto text-blue-700 dark:text-blue-300 h-auto p-0 justify-start sm:justify-center"
              onClick={() => window.open('https://openrouter.ai/keys', '_blank')}
            >
              <span className="flex items-center">
                Get a free API Key from OpenRouter <ExternalLink className="ml-1.5 h-3 w-3" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  )
}