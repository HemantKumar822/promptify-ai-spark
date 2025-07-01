import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: AuthError }>
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signInWithGoogle: () => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const getProfile = useCallback(async (user: User): Promise<Profile | null> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileData) {
      return profileData
    }
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
      console.error("Error fetching profile:", error)
      return null
    }
    
    console.log("No profile found, creating one...")
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New User',
        avatar_url: user.user_metadata?.avatar_url,
      })
      .select()
      .single()
      
    if (createError) {
      toast.error("Failed to initialize your user profile.")
      console.error("Error creating profile:", createError)
      return null
    }
    
    return newProfile
  }, [])

  useEffect(() => {
    setLoading(true)

    // 1. Get initial session and user data
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false) // Auth check is complete
    })

    // 2. Listen for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 3. Fetch profile whenever the user object changes
  useEffect(() => {
    if (user) {
      getProfile(user).then(setProfile)
    } else {
      setProfile(null)
    }
  }, [user, getProfile])

  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await getProfile(user);
      setProfile(updatedProfile);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    refreshProfile,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast.error(error.message)
      else toast.success('Welcome back!')
      return { error }
    },
    signUp: async (email: string, password: string, fullName?: string) => {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName } }
      })
      if (error) toast.error(error.message)
      else if (data.user) toast.success('Check your email for a confirmation link!')
      return { error }
    },
    signInWithGoogle: () => supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: window.location.origin }
    }),
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) toast.error(error.message)
      else toast.success('Signed out successfully!')
    },
    updateProfile: async (updates: Partial<Profile>) => {
      if (!user) return
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single()
      if (error) {
        toast.error(error.message)
      } else {
        setProfile(data)
        toast.success('Profile updated!')
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}