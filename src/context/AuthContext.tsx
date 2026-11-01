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
  logout: () => Promise<void>
  updateProfile: (updated: Partial<StudentProfile>) => void
  completeOnboarding: (data: Partial<StudentProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => storage.getProfile())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('smartstudy_auth') === 'true'
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isDemoMode = !isSupabaseConfigured

  useEffect(() => {
    const sb = supabase
    if (isSupabaseConfigured && sb) {
      sb.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true)
          // Fetch profile from supabase
          sb
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setProfile({
                  id: data.id,
                  fullName: data.full_name || session.user.email?.split('@')[0] || 'Student',
                  email: data.email || session.user.email || '',
                  college: data.college || '',
                  degree: data.degree || '',
                  department: data.department || '',
                  semester: data.semester || '',
                  targetCgpa: data.target_cgpa || 9.0,
                  dailyStudyHours: data.daily_study_hours || 4.0,
                  preferredStartTime: data.preferred_start_time || '09:00',
                  preferredEndTime: data.preferred_end_time || '22:00',
                  sleepStartTime: data.sleep_start_time || '23:00',
                  sleepEndTime: data.sleep_end_time || '07:00',
                  sessionDuration: data.session_duration || 50,
                  breakDuration: data.break_duration || 10,
                  weeklyHolidays: data.weekly_holidays || ['Sunday'],
                  timezone: data.timezone || 'UTC',
                  isOnboarded: true,
                  createdAt: data.created_at,
                  updatedAt: data.updated_at,
                })
              }
            })
        }
        setIsLoading(false)
      })

      const { data: authListener } = sb.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session)
        if (!session) {
          localStorage.removeItem('smartstudy_auth')
        }
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    } else {
      setIsLoading(false)
    }
  }, [isDemoMode])

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const sb = supabase
      if (isSupabaseConfigured && sb) {
        const { error } = await sb.auth.signInWithPassword({ email, password: pass })
        if (error) {
          setIsLoading(false)
          return { success: false, error: error.message }
        }
      }
      
      // Resilient local session
      localStorage.setItem('smartstudy_auth', 'true')
      setIsAuthenticated(true)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err.message || 'Login failed' }
    }
  }

  const register = async (email: string, pass: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const sb = supabase
      if (isSupabaseConfigured && sb) {
        const { error } = await sb.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: fullName } }
        })
        if (error) {
          setIsLoading(false)
          return { success: false, error: error.message }
        }
      }

      const newProfile: StudentProfile = {
        ...DEFAULT_PROFILE,
        id: `student-${Date.now()}`,
        fullName,
        email,
        isOnboarded: false, // Must complete onboarding wizard
      }

      storage.setProfile(newProfile)
      setProfile(newProfile)
      localStorage.setItem('smartstudy_auth', 'true')
      setIsAuthenticated(true)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err.message || 'Registration failed' }
    }
  }

  const logout = async () => {
    const sb = supabase
    if (isSupabaseConfigured && sb) {
      await sb.auth.signOut()
    }
    localStorage.removeItem('smartstudy_auth')
    setIsAuthenticated(false)
  }

  const updateProfile = (updated: Partial<StudentProfile>) => {
    const next = { ...profile, ...updated, updatedAt: new Date().toISOString() }
    setProfile(next)
    storage.setProfile(next)

    const sb = supabase
    if (isSupabaseConfigured && sb && profile.id) {
      sb.from('profiles').upsert({
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
    const onboardedProfile = {
      ...profile,
      ...data,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    }
    setProfile(onboardedProfile)
    storage.setProfile(onboardedProfile)
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
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
