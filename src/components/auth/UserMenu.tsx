import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { Settings, User, LogOut, Key, Cloud } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserMenuProps {
  onOpenSettings: () => void
  className?: string
}

export function UserMenu({ onOpenSettings, className }: UserMenuProps) {
  const { user, profile, signOut } = useAuth()

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("relative h-8 w-8 rounded-full", className)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer">
          <Key className="mr-2 h-4 w-4" />
          <span>API Keys</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Cloud className="mr-2 h-4 w-4" />
          <span>Sync Status</span>
          <span className="ml-auto text-xs text-green-600">✓ Synced</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}