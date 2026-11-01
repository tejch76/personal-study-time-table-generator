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

export const AppContent: React.FC = () => {
  const { isAuthenticated, profile, isLoading } = useAuth()
  const { activeTab } = useApp()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading SmartStudy AI...</span>
        </div>
      </div>
    )
  }

  // If not signed in, show high-converting Landing Page
  if (!isAuthenticated) {
    return <LandingPage />
  }

  // If newly registered student, display onboarding wizard
  if (!profile.isOnboarded) {
    return <OnboardingWizard />
  }

  // Render main student portal
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />
      case 'timetable':
        return <TimetablePage />
      case 'subjects':
        return <SubjectManagement />
      case 'exams':
        return <ExamCountdown />
      case 'pomodoro':
        return <PomodoroTimer />
      case 'syllabus':
        return <SyllabusTracker />
      case 'analytics':
        return <AnalyticsPage />
      case 'notes-tasks':
        return <NotesAndTasks />
      case 'settings':
        return <SettingsPage />
      default:
        return <StudentDashboard />
    }
  }

  return (
    <AppLayout>
      {renderTabContent()}
    </AppLayout>
  )
}

export default function App() {
  return <AppContent />
}
