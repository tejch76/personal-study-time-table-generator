export type Difficulty = 1 | 2 | 3 // 1: Easy, 2: Medium, 3: Hard
export type Priority = 1 | 2 | 3   // 1: Low, 2: Medium, 3: High
export type TimetableMode = 'balanced' | 'exam' | 'intensive'
export type SessionType = 'study' | 'revision' | 'practice_test' | 'break'
export type SessionStatus = 'scheduled' | 'completed' | 'missed' | 'rescheduled'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskType = 'assignment' | 'project' | 'revision' | 'reading' | 'other'
export type RevisionInterval = 1 | 3 | 7 | 14 | 30
export type PomodoroMode = 'pomodoro_25' | 'deep_50' | 'custom'

export interface StudentProfile {
  id: string
  fullName: string
  email: string
  college: string
  degree: string
  department: string
  semester: string
  targetCgpa: number
  dailyStudyHours: number
  preferredStartTime: string // "09:00"
  preferredEndTime: string   // "22:00"
  sleepStartTime: string     // "23:00"
  sleepEndTime: string       // "07:00"
  sessionDuration: number    // minutes (e.g. 50)
  breakDuration: number      // minutes (e.g. 10)
  weeklyHolidays: string[]   // ["Sunday"]
  timezone: string
  avatarUrl?: string
  isOnboarded: boolean
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  userId: string
  name: string
  code: string
  color: string
  difficulty: Difficulty
  priority: Priority
  totalChapters: number
  completedChapters: number
  weakTopics: string[]
  importantTopics: string[]
  examDate?: string // "YYYY-MM-DD"
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: string
  subjectId: string
  userId: string
  title: string
  chapterNumber: number
  isCompleted: boolean
  completedAt?: string
  revisionCount: number
  notes?: string
}

export interface Exam {
  id: string
  userId: string
  subjectId?: string
  subjectName: string
  examDate: string // "YYYY-MM-DD"
  examTime: string // "09:30"
  targetScore: string
  syllabusCompletion: number // 0-100%
  preparationStatus: 'not_started' | 'in_progress' | 'ready' | 'completed'
  importantTopics: string[]
  revisionChecklist: { id: string; text: string; done: boolean }[]
  createdAt: string
}

export interface StudySession {
  id: string
  timetableId?: string
  userId: string
  subjectId: string
  subjectName: string
  topic: string
  sessionDate: string // "YYYY-MM-DD"
  startTime: string   // "09:00"
  endTime: string     // "09:50"
  durationMinutes: number
  sessionType: SessionType
  status: SessionStatus
  rescheduledFrom?: string
  notes?: string
  color?: string
}

export interface Timetable {
  id: string
  userId: string
  title: string
  mode: TimetableMode
  startDate: string
  endDate: string
  isActive: boolean
  aiSummary?: string
  createdAt: string
}

export interface StudyTask {
  id: string
  userId: string
  subjectId?: string
  subjectName?: string
  title: string
  description?: string
  taskType: TaskType
  priority: TaskPriority
  dueDate: string
  isCompleted: boolean
  completedAt?: string
  createdAt: string
}

export interface Note {
  id: string
  userId: string
  subjectId?: string
  subjectName?: string
  title: string
  content: string
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface PomodoroSession {
  id: string
  userId: string
  subjectId?: string
  subjectName?: string
  durationMinutes: number
  mode: PomodoroMode
  completedAt: string
}

export interface RevisionRecord {
  id: string
  userId: string
  subjectId: string
  subjectName: string
  topic: string
  intervalDays: RevisionInterval
  scheduledDate: string
  completedDate?: string
  masteryScore?: number // 1-5
  status: 'pending' | 'completed' | 'overdue'
}

export interface AppNotification {
  id: string
  userId: string
  title: string
  message: string
  type: 'session_reminder' | 'exam_alert' | 'missed_session' | 'revision' | 'task' | 'system'
  isRead: boolean
  scheduledFor: string
  createdAt: string
}

export interface AIInsightResponse {
  fallback: boolean
  message?: string
  rationale: string
  tips: string[]
  motivation: string
  recommendedPriorities?: { subject: string; priorityReason: string }[]
}
