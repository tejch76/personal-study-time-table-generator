import React, { createContext, useContext, useState, useEffect } from 'react'
import { StudentProfile } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { storage, DEFAULT_PROFILE } from '../lib/storage'

interface AuthContextType {
  profile: StudentProfile
  isAuthenticated: boolean
  isLoading: boolean
  isDemoMode: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  demoLogin: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updated: Partial<StudentProfile>) => void
  completeOnboarding: (data: Partial<StudentProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_KEY = 'smartstudy_auth_v2'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isDemoMode = !isSupabaseConfigured

  // On mount — resolve auth state
  useEffect(() => {
    const init = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            setIsAuthenticated(true)
            const savedProfile = storage.getProfile()
            if (savedProfile) {
              setProfile(savedProfile)
            }
          } else {
            setIsAuthenticated(false)
            localStorage.removeItem(AUTH_KEY)
          }
        } else {
          // Local/Demo mode: check if authenticated
          const localAuth = localStorage.getItem(AUTH_KEY)
          if (localAuth === 'true') {
            const savedProfile = storage.getProfile()
            if (savedProfile) {
              setProfile(savedProfile)
            } else {
              setProfile(DEFAULT_PROFILE)
            }
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    init()

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session)
        if (!session) {
          localStorage.removeItem(AUTH_KEY)
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
        if (error) {
          setIsLoading(false)
          return { success: false, error: error.message }
        }
      }

      // Check if there is an existing profile for this email
      const saved = storage.getProfile()
      if (saved && saved.email?.toLowerCase() === email.toLowerCase()) {
        setProfile(saved)
      } else {
        const newProfile: StudentProfile = {
          ...DEFAULT_PROFILE,
          id: `student-${Date.now()}`,
          email,
          fullName: email.split('@')[0],
          isOnboarded: true, // Allow user into dashboard immediately
        }
        storage.setProfile(newProfile)
        setProfile(newProfile)
      }

      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err?.message || 'Login failed. Please try again.' }
    }
  }

  const register = async (email: string, pass: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: fullName } },
        })
        if (error) {
          setIsLoading(false)
          return { success: false, error: error.message }
        }
      }

      const newProfile: StudentProfile = {
        ...DEFAULT_PROFILE,
        id: `student-${Date.now()}`,
        fullName: fullName || email.split('@')[0],
        email,
        isOnboarded: true,
      }

      storage.setProfile(newProfile)
      setProfile(newProfile)
      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err?.message || 'Registration failed. Please try again.' }
    }
  }

  const demoLogin = async () => {
    setIsLoading(true)
    const demoProfile: StudentProfile = {
      ...DEFAULT_PROFILE,
      isOnboarded: true,
    }
    storage.setProfile(demoProfile)
    setProfile(demoProfile)
    localStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
    setIsLoading(false)
  }

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(AUTH_KEY)
    setProfile(DEFAULT_PROFILE)
    setIsAuthenticated(false)
  }

  const updateProfile = (updated: Partial<StudentProfile>) => {
    const next = { ...profile, ...updated, updatedAt: new Date().toISOString() }
    setProfile(next)
    storage.setProfile(next)

    if (isSupabaseConfigured && supabase && profile.id) {
      supabase.from('profiles').upsert({
        id: profile.id,
        full_name: next.fullName,
        college: next.college,
        degree: next.degree,
        department: next.department,
        semester: next.semester,
        target_cgpa: next.targetCgpa,
        daily_study_hours: next.dailyStudyHours,
        preferred_start_time: next.preferredStartTime,
        preferred_end_time: next.preferredEndTime,
        sleep_start_time: next.sleepStartTime,
        sleep_end_time: next.sleepEndTime,
        session_duration: next.sessionDuration,
        break_duration: next.breakDuration,
        weekly_holidays: next.weeklyHolidays,
        timezone: next.timezone,
      }).then()
    }
  }

  const completeOnboarding = (data: Partial<StudentProfile>) => {
    const onboarded = {
      ...profile,
      ...data,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    }
    setProfile(onboarded)
    storage.setProfile(onboarded)
  }

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated,
        isLoading,
        isDemoMode,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
