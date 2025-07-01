import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

interface SimpleUserAvatarProps {
  onOpenSettings?: () => void
  className?: string
}

export function SimpleUserAvatar({ onOpenSettings, className }: SimpleUserAvatarProps) {
  const { user, profile } = useAuth()

  if (!user) return null

  const getInitials = (name: string | null | undefined, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
  const initials = getInitials(profile?.full_name, user.email || '')

  return (
    <Button
      variant="ghost"
      onClick={onOpenSettings}
      className={`relative h-10 w-10 rounded-full p-0 hover:bg-accent ${className}`}
      title={`${displayName} - Click for settings`}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage 
          src={profile?.avatar_url || user.user_metadata?.avatar_url} 
          alt={displayName}
          className="object-cover"
        />
        <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Button>
  )
}