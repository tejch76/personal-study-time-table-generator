import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Subject,
  Exam,
  StudySession,
  StudyTask,
  Note,
  PomodoroSession,
  RevisionRecord,
  AppNotification,
  TimetableMode,
  AIInsightResponse
} from '../types'
import { storage } from '../lib/storage'
import { useAuth } from './AuthContext'
import { generateStudyTimetable } from '../lib/scheduler/algorithm'
import { rescheduleMissedSession } from '../lib/scheduler/rescheduler'
import { sendBrowserNotification, playChime } from '../lib/notifications'
import confetti from 'canvas-confetti'

interface AppContextType {
  // Navigation / Active View
  activeTab: string
  setActiveTab: (tab: string) => void

  // Theme
  isDarkMode: boolean
  toggleTheme: () => void

  // Subjects
  subjects: Subject[]
  addSubject: (sub: Omit<Subject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  updateSubject: (id: string, sub: Partial<Subject>) => void
  deleteSubject: (id: string) => void

  // Exams
  exams: Exam[]
  addExam: (exam: Omit<Exam, 'id' | 'userId' | 'createdAt'>) => void
  updateExam: (id: string, exam: Partial<Exam>) => void
  deleteExam: (id: string) => void

  // Sessions & Timetable
  sessions: StudySession[]
  timetableMode: TimetableMode
  setTimetableMode: (mode: TimetableMode) => void
  generateTimetable: (mode?: TimetableMode) => void
  markSessionStatus: (id: string, status: StudySession['status']) => void
  rescheduleSession: (id: string) => { success: boolean; message: string }
  addCustomSession: (session: Omit<StudySession, 'id' | 'userId'>) => void
  deleteSession: (id: string) => void

  // AI Insights
  aiInsights: AIInsightResponse | null
  isAiLoading: boolean
  fetchAiAdvice: () => Promise<void>

  // Tasks
  tasks: StudyTask[]
  addTask: (task: Omit<StudyTask, 'id' | 'userId' | 'createdAt'>) => void
  updateTask: (id: string, task: Partial<StudyTask>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void

  // Notes
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void

  // Pomodoro
  pomodoroSessions: PomodoroSession[]
  recordPomodoroSession: (durationMinutes: number, mode: PomodoroSession['mode'], subjectId?: string, subjectName?: string) => void

  // Spaced Revision
  revisionRecords: RevisionRecord[]
  completeRevision: (id: string, masteryScore: number) => void
  addRevisionRecord: (record: Omit<RevisionRecord, 'id' | 'userId'>) => void

  // Notifications
  notifications: AppNotification[]
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void

  // Metrics
  todayFocusMinutes: number
  currentStreakDays: number
  syllabusCompletionPercent: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartstudy_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('smartstudy_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('smartstudy_theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(prev => !prev)

  // Primary data states
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects())
  const [exams, setExams] = useState<Exam[]>(() => storage.getExams())
  const [sessions, setSessions] = useState<StudySession[]>(() => storage.getSessions())
  const [tasks, setTasks] = useState<StudyTask[]>(() => storage.getTasks())
  const [notes, setNotes] = useState<Note[]>(() => storage.getNotes())
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(() => storage.getPomodoro())
  const [revisionRecords, setRevisionRecords] = useState<RevisionRecord[]>(() => storage.getRevision())
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storage.getNotifications())

  const [timetableMode, setTimetableMode] = useState<TimetableMode>('balanced')
  const [aiInsights, setAiInsights] = useState<AIInsightResponse | null>(null)
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false)

  // Sync to local storage
  useEffect(() => { storage.setSubjects(subjects) }, [subjects])
  useEffect(() => { storage.setExams(exams) }, [exams])
  useEffect(() => { storage.setSessions(sessions) }, [sessions])
  useEffect(() => { storage.setTasks(tasks) }, [tasks])
  useEffect(() => { storage.setNotes(notes) }, [notes])
  useEffect(() => { storage.setPomodoro(pomodoroSessions) }, [pomodoroSessions])
  useEffect(() => { storage.setRevision(revisionRecords) }, [revisionRecords])
  useEffect(() => { storage.setNotifications(notifications) }, [notifications])

  // Subject Handlers
  const addSubject = (sub: Omit<Subject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newSub: Subject = {
      ...sub,
      id: `sub-${Date.now()}`,
      userId: profile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSubjects(prev => [...prev, newSub])
  }

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated, updatedAt: new Date().toISOString() } : s))
  }

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
    setSessions(prev => prev.filter(s => s.subjectId !== id))
    setExams(prev => prev.filter(e => e.subjectId !== id))
  }

  // Exam Handlers
  const addExam = (exam: Omit<Exam, 'id' | 'userId' | 'createdAt'>) => {
    const newExam: Exam = {
      ...exam,
      id: `exam-${Date.now()}`,
      userId: profile.id,
      createdAt: new Date().toISOString(),
    }
    setExams(prev => [...prev, newExam])
  }

  const updateExam = (id: string, updated: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e))
  }

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id))
  }

  // Timetable Generation
  const generateTimetable = (mode: TimetableMode = timetableMode) => {
    setTimetableMode(mode)
    const result = generateStudyTimetable(profile, subjects, exams, { mode, daysCount: 7 })

    setSessions(result.sessions)

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      })
    } catch {}

    // Add in-app notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: profile.id,
      title: `${mode.toUpperCase()} Timetable Generated`,
      message: result.summary.explanation,
      type: 'system',
      isRead: false,
      scheduledFor: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const markSessionStatus = (id: string, status: StudySession['status']) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === id) {
          if (status === 'completed') {
            playChime('complete')
          }
          return { ...s, status }
        }
        return s
      })
    )
  }

  const rescheduleSession = (id: string): { success: boolean; message: string } => {
    const missed = sessions.find(s => s.id === id)
    if (!missed) return { success: false, message: 'Session not found' }

    const result = rescheduleMissedSession(missed, sessions, profile, exams)
    if (result) {
      // Update the old session to 'rescheduled' and append the new session
      setSessions(prev => [
        ...prev.map(s => s.id === id ? { ...s, status: 'rescheduled' as const } : s),
        result.rescheduledSession
      ])

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: profile.id,
        title: 'Session Rescheduled',
        message: result.message,
        type: 'session_reminder',
        isRead: false,
        scheduledFor: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
      setNotifications(prev => [notif, ...prev])
      return { success: true, message: result.message }
    } else {
      return {
        success: false,
        message: 'Could not find an open slot within study hours before the exam deadline. Consider extending daily study hours in settings.'
      }
    }
  }

  const addCustomSession = (session: Omit<StudySession, 'id' | 'userId'>) => {
    const newSess: StudySession = {
      ...session,
      id: `custom-sess-${Date.now()}`,
      userId: profile.id,
    }
    setSessions(prev => [...prev, newSess])
  }

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  // AI insights fetcher
  const fetchAiAdvice = async () => {
    setIsAiLoading(true)
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: subjects.map(s => ({ name: s.name, difficulty: s.difficulty, priority: s.priority })),
          targetCgpa: profile.targetCgpa,
          mode: timetableMode,
          studyHours: profile.dailyStudyHours,
          upcomingExams: exams.map(e => ({ name: e.subjectName, date: e.examDate })),
          weakTopics: subjects.flatMap(s => s.weakTopics || []),
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiInsights(data)
      } else {
        throw new Error('API request failed')
      }
    } catch {
      // Offline / Local AI advice synthesis
      setAiInsights({
        fallback: true,
        message: 'Intelligent algorithmic recommendation engine active.',
        rationale: `Your current schedule strategically allocates study volume towards ${subjects[0]?.name || 'core subjects'} while safeguarding ${profile.breakDuration || 10}-minute inter-session rest buffers.`,
        tips: [
          'High difficulty topics are scheduled during early morning focus blocks.',
          'Consistently test active recall after each Pomodoro cycle rather than passive reading.',
          'Space out your revision sessions at 1, 3, and 7-day intervals for maximum retention.'
        ],
        motivation: 'Small daily disciplines repeated consistently lead to exponential academic breakthroughs.',
        recommendedPriorities: subjects.slice(0, 2).map(s => ({
          subject: s.name,
          priorityReason: `Pending syllabus and high conceptual weight.`
        }))
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  // Task Handlers
  const addTask = (task: Omit<StudyTask, 'id' | 'userId' | 'createdAt'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}`,
      userId: profile.id,
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }

  const updateTask = (id: string, updated: Partial<StudyTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isDone = !t.isCompleted
          if (isDone) playChime('complete')
          return {
            ...t,
            isCompleted: isDone,
            completedAt: isDone ? new Date().toISOString() : undefined,
          }
        }
        return t
      })
    )
  }

  // Notes Handlers
  const addNote = (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      userId: profile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes(prev => [newNote, ...prev])
  }

  const updateNote = (id: string, updated: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n))
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // Pomodoro
  const recordPomodoroSession = (durationMinutes: number, mode: PomodoroSession['mode'], subjectId?: string, subjectName?: string) => {
    const newPomo: PomodoroSession = {
      id: `pomo-${Date.now()}`,
      userId: profile.id,
      subjectId,
      subjectName,
      durationMinutes,
      mode,
      completedAt: new Date().toISOString(),
    }
    setPomodoroSessions(prev => [newPomo, ...prev])

    // Browser notification
    sendBrowserNotification('Pomodoro Session Complete! 🎉', {
      body: `You crushed ${durationMinutes} minutes of focused study. Time for a well-deserved break!`,
    })
  }

  // Spaced Revision
  const completeRevision = (id: string, masteryScore: number) => {
    setRevisionRecords(prev =>
      prev.map(r => r.id === id ? {
        ...r,
        status: 'completed',
        completedDate: new Date().toISOString().split('T')[0],
        masteryScore
      } : r)
    )
    playChime('complete')
  }

  const addRevisionRecord = (record: Omit<RevisionRecord, 'id' | 'userId'>) => {
    const newRec: RevisionRecord = {
      ...record,
      id: `rev-${Date.now()}`,
      userId: profile.id,
    }
    setRevisionRecords(prev => [...prev, newRec])
  }

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Calculated Metrics
  const todayStr = new Date().toISOString().split('T')[0]
  const todayFocusMinutes = pomodoroSessions
    .filter(p => p.completedAt.startsWith(todayStr))
    .reduce((sum, p) => sum + p.durationMinutes, 0)

  const currentStreakDays = 5 // Active 5-day study streak
  const totalChapters = subjects.reduce((sum, s) => sum + (s.totalChapters || 1), 0)
  const completedChapters = subjects.reduce((sum, s) => sum + (s.completedChapters || 0), 0)
  const syllabusCompletionPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleTheme,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        exams,
        addExam,
        updateExam,
        deleteExam,
        sessions,
        timetableMode,
        setTimetableMode,
        generateTimetable,
        markSessionStatus,
        rescheduleSession,
        addCustomSession,
        deleteSession,
        aiInsights,
        isAiLoading,
        fetchAiAdvice,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        notes,
        addNote,
        updateNote,
        deleteNote,
        pomodoroSessions,
        recordPomodoroSession,
        revisionRecords,
        completeRevision,
        addRevisionRecord,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        todayFocusMinutes,
        currentStreakDays,
        syllabusCompletionPercent,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
