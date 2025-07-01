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
  const { user, profile, loading, signOut, refreshProfile } = useAuth()

  // Show a loading skeleton while the user session is being restored.
  if (loading) {
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  // If there is no user after loading, the user is not logged in.
  if (!user) {
    // In a real app, you might return a <SignInButton /> here.
    // For now, returning null keeps the header clean.
    return null;
  }

  // At this point, loading is false and we have a user.
  // We can now safely render the user menu.
  // The profile might still be loading for a frame, but we can handle that gracefully.

  const getInitials = (name: string | null | undefined, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    // Fallback to email if name is not available
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return '??'; // Ultimate fallback
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
  const initials = getInitials(profile?.full_name, user.email || '')
  const avatarUrl = profile?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "user-menu-trigger relative h-10 w-10 rounded-full p-0 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", 
            className
          )}
        >
          <Avatar className="h-9 w-9">
            {avatarUrl && <AvatarImage 
              src={avatarUrl} 
              alt={displayName}
              className="object-cover"
            />}
            <AvatarFallback className="user-avatar-fallback text-sm font-medium bg-gradient-to-br from-blue-400 to-purple-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="user-menu-content w-64 p-2" 
        align="end" 
        alignOffset={-4}
        sideOffset={8}
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          onClick={onOpenSettings} 
          className="cursor-pointer p-2 focus:bg-accent hover:bg-accent"
        >
          <Settings className="mr-3 h-4 w-4" />
          <span>Settings & Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onOpenSettings} 
          className="cursor-pointer p-2 focus:bg-accent hover:bg-accent"
        >
          <Key className="mr-3 h-4 w-4" />
          <span>API Keys</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer p-2 focus:bg-accent hover:bg-accent">
          <Cloud className="mr-3 h-4 w-4" />
          <span>Sync Status</span>
          <span className="ml-auto text-xs text-green-600 font-medium">✓ Synced</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          onClick={signOut} 
          className="cursor-pointer p-2 text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}