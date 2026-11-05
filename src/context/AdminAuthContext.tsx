import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC
} from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AdminProfile {
  id: string
  email: string
  fullName: string
  role: 'superadmin' | 'admin' | 'editor' | 'moderator'
}

export interface AdminAuthContextType {
  user: User | null
  currentUser: User | null
  profile: AdminProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isNormalUser: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  publicLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  publicSignUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: (customRedirectTo?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isSupabaseReady: boolean
  verifyAdminAuthorization: (user: User) => Promise<AdminProfile | null>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Helper: strictly verify administrator authorization via secure channels (app_metadata or admin_users table)
// NEVER trust user_metadata as it is client-editable in Supabase!
export const verifyAdminAuthorization = async (
  user: User
): Promise<AdminProfile | null> => {
  const email = user.email || ''
  const fullName = user.user_metadata?.full_name || 'Mountain Administrator'

  // 1. Check secure server-controlled app_metadata (cannot be modified by client)
  const appRole = (user.app_metadata?.role as AdminProfile['role']) || null
  if (appRole && ['superadmin', 'admin', 'editor', 'moderator'].includes(appRole)) {
    return {
      id: user.id,
      email,
      fullName,
      role: appRole
    }
  }

  // 2. Check secure PostgreSQL admin_users table
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .or(`user_id.eq.${user.id},email.eq.${email}`)
      .maybeSingle()

    if (!error && data && ['superadmin', 'admin', 'editor', 'moderator'].includes(data.role)) {
      return {
        id: user.id,
        email,
        fullName,
        role: data.role as AdminProfile['role']
      }
    }
  } catch {
    // If admin_users table is not yet configured or query fails, default to strict denial
  }

  return null
}

export const AdminAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isSupabaseReady = isSupabaseConfigured()

  useEffect(() => {
    if (!isSupabaseReady) {
      setIsLoading(false)
      return
    }

    const processSession = async (currentSession: Session | null) => {
      setSession(currentSession)
      if (currentSession?.user) {
        setCurrentUser(currentSession.user)
        const verifiedProfile = await verifyAdminAuthorization(currentSession.user)
        if (verifiedProfile) {
          setUser(currentSession.user)
          setProfile(verifiedProfile)
        } else {
          // Ordinary authenticated user without admin privileges
          // NEVER grant admin permissions automatically
          setUser(null)
          setProfile(null)
        }
      } else {
        setCurrentUser(null)
        setUser(null)
        setProfile(null)
      }
      setIsLoading(false)
    }

    // 1. Initial session check with strict role verification
    supabase.auth.getSession().then(({ data: { session } }) => {
      processSession(session)
    })

    // 2. Auth state change listener with strict verification
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      processSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isSupabaseReady])

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseReady) {
      return { success: false, error: 'Supabase credentials not configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user || !data.session) {
        return { success: false, error: 'Authentication failed.' }
      }

      // Verify that this user is actually an administrator (NOT an ordinary authenticated user)
      const verifiedProfile = await verifyAdminAuthorization(data.user)

      if (!verifiedProfile) {
        // Sign out immediately: unauthorized ordinary user attempted admin login
        await supabase.auth.signOut()
        setCurrentUser(null)
        setUser(null)
        setSession(null)
        setProfile(null)
        return {
          success: false,
          error: 'Access Denied: This account does not have administrative staff authorization.'
        }
      }

      setSession(data.session)
      setCurrentUser(data.user)
      setUser(data.user)
      setProfile(verifiedProfile)
      return { success: true }
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Login failed'
      }
    }
  }

  const publicLogin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseReady) {
      return { success: false, error: 'Supabase credentials not configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.session || !data.user) {
        return { success: false, error: 'Authentication failed.' }
      }

      // Successful public sign in
      setSession(data.session)
      setCurrentUser(data.user)

      // Check if user happens to also be a verified staff admin
      const verified = await verifyAdminAuthorization(data.user)
      if (verified) {
        setUser(data.user)
        setProfile(verified)
      } else {
        setUser(null)
        setProfile(null)
      }

      return { success: true }
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Login failed'
      }
    }
  }

  const publicSignUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseReady) {
      return { success: false, error: 'Supabase credentials not configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
            // NEVER assign admin roles in user_metadata!
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.session && data.user) {
        setSession(data.session)
        setCurrentUser(data.user)
        setUser(null)
        setProfile(null)
      }

      return { success: true }
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Signup failed'
      }
    }
  }

  const loginWithGoogle = async (
    customRedirectTo?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseReady) {
      return { success: false, error: 'Supabase credentials not configured in .env' }
    }

    try {
      const redirectUrl = customRedirectTo || `${window.location.origin}/auth/callback`
      const { data: _data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Google OAuth initialization failed'
      }
    }
  }

  const logout = async (): Promise<void> => {
    if (isSupabaseReady) {
      await supabase.auth.signOut()
    }
    setCurrentUser(null)
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        currentUser,
        profile,
        session,
        isLoading,
        isAuthenticated: Boolean(user && profile),
        isNormalUser: Boolean(currentUser && !profile),
        login,
        publicLogin,
        publicSignUp,
        loginWithGoogle,
        logout,
        isSupabaseReady,
        verifyAdminAuthorization
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
