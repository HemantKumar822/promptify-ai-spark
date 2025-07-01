import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Mail, Lock, User, Chrome } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('signin')

  const [signinForm, setSigninForm] = useState({
    email: '',
    password: ''
  })

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(signinForm.email, signinForm.password)
    
    setLoading(false)
    if (!error) {
      onOpenChange(false)
      setSigninForm({ email: '', password: '' })
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signupForm.password !== signupForm.confirmPassword) {
      return
    }

    setLoading(true)
    const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName)
    
    setLoading(false)
    if (!error) {
      onOpenChange(false)
      setSignupForm({ email: '', password: '', fullName: '', confirmPassword: '' })
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await signInWithGoogle()
    setLoading(false)
    
    if (!error) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Welcome to AI Prompt Engineer
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Sign in to sync your prompts across all devices
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signinForm.email}
                    onChange={(e) => setSigninForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signinForm.password}
                    onChange={(e) => setSigninForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full promptify-gradient"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={cn(
                      "pl-10",
                      signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && "border-destructive focus-visible:ring-destructive"
                    )}
                    required
                  />
                  {signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full promptify-gradient"
                disabled={loading || signupForm.password !== signupForm.confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  )
}