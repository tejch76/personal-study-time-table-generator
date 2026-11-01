import React from 'react'
import { useAuth } from './context/AuthContext'
import { useApp } from './context/AppContext'
import { LandingPage } from './components/landing/LandingPage'
import { OnboardingWizard } from './components/onboarding/OnboardingWizard'
import { AppLayout } from './components/layout/AppLayout'
import { StudentDashboard } from './components/dashboard/StudentDashboard'
import { TimetablePage } from './components/timetable/TimetablePage'
import { SubjectManagement } from './components/subjects/SubjectManagement'
import { ExamCountdown } from './components/exams/ExamCountdown'
import { PomodoroTimer } from './components/pomodoro/PomodoroTimer'
import { SyllabusTracker } from './components/syllabus/SyllabusTracker'
import { AnalyticsPage } from './components/analytics/AnalyticsPage'
import { NotesAndTasks } from './components/notes/NotesAndTasks'
import { SettingsPage } from './components/settings/SettingsPage'
import { GraduationCap } from 'lucide-react'

// Full-screen loading spinner shown while auth resolves
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
        <GraduationCap className="w-7 h-7 text-white" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin bg-transparent" />
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">SmartStudy AI</p>
      <p className="text-xs text-slate-400 mt-0.5">Loading your workspace...</p>
    </div>
  </div>
)

export const AppContent: React.FC = () => {
  const { isAuthenticated, profile, isLoading } = useAuth()
  const { activeTab } = useApp()

  // Show spinner while auth state is resolving
  if (isLoading) {
    return <LoadingScreen />
  }

  // Not signed in → show landing page
  if (!isAuthenticated) {
    return <LandingPage />
  }

  // Signed in but onboarding not complete → wizard
  if (!profile.isOnboarded) {
    return <OnboardingWizard />
  }

  // Main authenticated app
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':   return <StudentDashboard />
      case 'timetable':   return <TimetablePage />
      case 'subjects':    return <SubjectManagement />
      case 'exams':       return <ExamCountdown />
      case 'pomodoro':    return <PomodoroTimer />
      case 'syllabus':    return <SyllabusTracker />
      case 'analytics':   return <AnalyticsPage />
      case 'notes-tasks': return <NotesAndTasks />
      case 'settings':    return <SettingsPage />
      default:            return <StudentDashboard />
    }
  }

  return (
    <AppLayout>
      {renderTab()}
    </AppLayout>
  )
}

export default function App() {
  return <AppContent />
}
