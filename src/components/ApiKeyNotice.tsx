import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Key, ExternalLink, Info } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface ApiKeyNoticeProps {
  onOpenSettings?: () => void
  onOpenAuth?: () => void
}

export function ApiKeyNotice({ onOpenSettings, onOpenAuth }: ApiKeyNoticeProps) {
  const { user } = useAuth()

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
      <Key className="h-4 w-4 text-orange-600" />
      <AlertDescription className="space-y-3">
        <div className="text-sm text-orange-800 dark:text-orange-200">
          <strong>API Key Required:</strong> To use AI prompt enhancement, you need to provide your own OpenRouter API key.
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {user ? (
            <Button onClick={onOpenSettings} size="sm" variant="outline" className="border-orange-300 hover:bg-orange-100">
              <Key className="mr-2 h-4 w-4" />
              Add API Key in Settings
            </Button>
          ) : (
            <Button onClick={onOpenAuth} size="sm" variant="outline" className="border-orange-300 hover:bg-orange-100">
              <Key className="mr-2 h-4 w-4" />
              Sign In to Save API Key
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-orange-700 hover:text-orange-800 hover:bg-orange-100"
            onClick={() => window.open('https://openrouter.ai/keys', '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Get API Key (Free)
          </Button>
        </div>
        
        <div className="text-xs text-orange-700 dark:text-orange-300 flex items-start gap-2">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            OpenRouter provides free API credits monthly. Your key is encrypted and stored securely.
          </span>
        </div>
      </AlertDescription>
    </Alert>
  )
}