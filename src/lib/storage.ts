import { StudentProfile, Subject, Chapter, Exam, StudySession, StudyTask, Note, PomodoroSession, RevisionRecord, AppNotification } from '../types'
import { format, addDays } from 'date-fns'

const STORAGE_KEYS = {
  PROFILE: 'smartstudy_profile',
  SUBJECTS: 'smartstudy_subjects',
  CHAPTERS: 'smartstudy_chapters',
  EXAMS: 'smartstudy_exams',
  SESSIONS: 'smartstudy_sessions',
  TASKS: 'smartstudy_tasks',
  NOTES: 'smartstudy_notes',
  POMODORO: 'smartstudy_pomodoro',
  REVISION: 'smartstudy_revision',
  NOTIFICATIONS: 'smartstudy_notifications',
  THEME: 'smartstudy_theme',
}

const today = new Date()
const todayStr = format(today, 'yyyy-MM-dd')

export const DEFAULT_PROFILE: StudentProfile = {
  id: 'demo-student-id',
  fullName: 'Alex Vance',
  email: 'alex.vance@university.edu',
  college: 'Stanford University / Institute of Technology',
  degree: 'Bachelor of Science',
  department: 'Computer Science & Engineering',
  semester: 'Semester 5 (Year 3)',
  targetCgpa: 9.2,
  dailyStudyHours: 4.5,
  preferredStartTime: '09:00',
  preferredEndTime: '21:30',
  sleepStartTime: '23:30',
  sleepEndTime: '07:00',
  sessionDuration: 50,
  breakDuration: 10,
  weeklyHolidays: ['Sunday'],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  isOnboarded: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    userId: 'demo-student-id',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    color: '#6366f1', // Indigo
    difficulty: 3,
    priority: 3,
    totalChapters: 12,
    completedChapters: 7,
    weakTopics: ['Dynamic Programming', 'Graph Shortest Paths', 'Red-Black Trees'],
    importantTopics: ['Binary Search Trees', 'Heap Sort', 'Greedy Algorithms'],
    examDate: format(addDays(today, 12), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    userId: 'demo-student-id',
    name: 'Operating Systems',
    code: 'CS302',
    color: '#0ea5e9', // Sky blue
    difficulty: 2,
    priority: 3,
    totalChapters: 10,
    completedChapters: 6,
    weakTopics: ['Virtual Memory Paging', 'Deadlock Detection'],
    importantTopics: ['Process Synchronization & Semaphores', 'CPU Scheduling'],
    examDate: format(addDays(today, 18), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    userId: 'demo-student-id',
    name: 'Database Management Systems',
    code: 'CS303',
    color: '#10b981', // Emerald
    difficulty: 2,
    priority: 2,
    totalChapters: 8,
    completedChapters: 5,
    weakTopics: ['Query Optimization', 'Multi-version Concurrency Control'],
    importantTopics: ['B+ Tree Indexing', 'Normalization (BCNF, 3NF)', 'ACID Transactions'],
    examDate: format(addDays(today, 25), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-4',
    userId: 'demo-student-id',
    name: 'Machine Learning Foundations',
    code: 'CS304',
    color: '#8b5cf6', // Violet
    difficulty: 3,
    priority: 2,
    totalChapters: 10,
    completedChapters: 4,
    weakTopics: ['Backpropagation Gradient Math', 'Support Vector Machines'],
    importantTopics: ['Linear Regression', 'Logistic Regression', 'Overfitting & Regularization'],
    examDate: format(addDays(today, 32), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const DEFAULT_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    examDate: format(addDays(today, 12), 'yyyy-MM-dd'),
    examTime: '09:30 AM',
    targetScore: 'Grade A+ (95%)',
    syllabusCompletion: 58,
    preparationStatus: 'in_progress',
    importantTopics: ['Dynamic Programming', 'Graph Algorithms', 'Trees & Heaps'],
    revisionChecklist: [
      { id: 'chk-1', text: 'Solve 10 LeetCode Medium DP problems', done: true },
      { id: 'chk-2', text: 'Revise Dijkstra and Bellman-Ford proofs', done: false },
      { id: 'chk-3', text: 'Complete Mock Midterm Exam 1', done: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-2',
    userId: 'demo-student-id',
    subjectId: 'sub-2',
    subjectName: 'Operating Systems',
    examDate: format(addDays(today, 18), 'yyyy-MM-dd'),
    examTime: '02:00 PM',
    targetScore: 'Grade A (90%)',
    syllabusCompletion: 60,
    preparationStatus: 'in_progress',
    importantTopics: ['Process Synchronization', 'Memory Management', 'File Systems'],
    revisionChecklist: [
      { id: 'chk-4', text: 'Review Dining Philosophers & Producer-Consumer', done: true },
      { id: 'chk-5', text: 'Practice Page Replacement algorithms', done: false },
    ],
    createdAt: new Date().toISOString(),
  },
]

export const DEFAULT_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Dynamic Programming & Memoization',
    sessionDate: todayStr,
    startTime: '09:00',
    endTime: '09:50',
    durationMinutes: 50,
    sessionType: 'study',
    status: 'completed',
    color: '#6366f1',
  },
  {
    id: 'sess-2',
    userId: 'demo-student-id',
    subjectId: 'sub-2',
    subjectName: 'Operating Systems',
    topic: 'Process Synchronization & Semaphores',
    sessionDate: todayStr,
    startTime: '10:05',
    endTime: '10:55',
    durationMinutes: 50,
    sessionType: 'study',
    status: 'scheduled',
    color: '#0ea5e9',
  },
  {
    id: 'sess-3',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Graph Shortest Paths (Dijkstra)',
    sessionDate: todayStr,
    startTime: '14:30',
    endTime: '15:20',
    durationMinutes: 50,
    sessionType: 'revision',
    status: 'scheduled',
    color: '#6366f1',
  },
  {
    id: 'sess-4',
    userId: 'demo-student-id',
    subjectId: 'sub-3',
    subjectName: 'Database Management Systems',
    topic: 'B+ Tree Indexing & Query Plans',
    sessionDate: todayStr,
    startTime: '16:00',
    endTime: '16:50',
    durationMinutes: 50,
    sessionType: 'study',
    status: 'scheduled',
    color: '#10b981',
  },
  // Upcoming session on tomorrow
  {
    id: 'sess-5',
    userId: 'demo-student-id',
    subjectId: 'sub-4',
    subjectName: 'Machine Learning Foundations',
    topic: 'Linear Regression & Cost Function Optimization',
    sessionDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    startTime: '09:30',
    endTime: '10:20',
    durationMinutes: 50,
    sessionType: 'study',
    status: 'scheduled',
    color: '#8b5cf6',
  },
  // A missed session from yesterday to showcase automatic rescheduling!
  {
    id: 'sess-missed',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Red-Black Tree Rotations',
    sessionDate: format(addDays(today, -1), 'yyyy-MM-dd'),
    startTime: '17:00',
    endTime: '17:50',
    durationMinutes: 50,
    sessionType: 'study',
    status: 'missed',
    color: '#6366f1',
  }
]

export const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    title: 'Assignment 3: Implement AVL Trees & Benchmarking',
    description: 'Write clean C++ or Python code with time complexity analysis.',
    taskType: 'assignment',
    priority: 'high',
    dueDate: format(addDays(today, 4), 'yyyy-MM-dd'),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    userId: 'demo-student-id',
    subjectId: 'sub-2',
    subjectName: 'Operating Systems',
    title: 'OS Lab: Multithreaded Matrix Multiplication',
    description: 'Use POSIX pthreads and mutex locks to prevent race conditions.',
    taskType: 'project',
    priority: 'medium',
    dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    userId: 'demo-student-id',
    subjectId: 'sub-3',
    subjectName: 'Database Management Systems',
    title: 'SQL Normalization Problem Set 4',
    description: 'Decompose relations into BCNF and 3NF without losing dependencies.',
    taskType: 'assignment',
    priority: 'medium',
    dueDate: format(addDays(today, 2), 'yyyy-MM-dd'),
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
]

export const DEFAULT_NOTES: Note[] = [
  {
    id: 'note-1',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    title: 'Dynamic Programming Cheat Sheet',
    content: '1. Identify overlapping subproblems and optimal substructure.\n2. State definition: dp[i][j] represents the optimum value up to element i with constraint j.\n3. Base cases: always establish empty/0 conditions.\n4. Space optimization: can we compress 2D DP to 1D using rolling arrays?',
    tags: ['Algorithms', 'CheatSheet', 'ExamPrep'],
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    userId: 'demo-student-id',
    subjectId: 'sub-2',
    subjectName: 'Operating Systems',
    title: 'Deadlock Coffman Conditions',
    content: 'All 4 must hold simultaneously for a deadlock:\n- Mutual Exclusion\n- Hold and Wait\n- No Preemption\n- Circular Wait\nBreaking any one of these guarantees deadlock freedom!',
    tags: ['OS', 'Concepts', 'Midterm'],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const DEFAULT_POMODORO: PomodoroSession[] = [
  {
    id: 'pomo-1',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    durationMinutes: 50,
    mode: 'deep_50',
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'pomo-2',
    userId: 'demo-student-id',
    subjectId: 'sub-2',
    subjectName: 'Operating Systems',
    durationMinutes: 25,
    mode: 'pomodoro_25',
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
]

export const DEFAULT_REVISIONS: RevisionRecord[] = [
  {
    id: 'rev-1',
    userId: 'demo-student-id',
    subjectId: 'sub-1',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Graph Shortest Paths (Dijkstra)',
    intervalDays: 3,
    scheduledDate: todayStr,
    status: 'pending',
  },
  {
    id: 'rev-2',
    userId: 'demo-student-id',
    subjectId: 'sub-2',
    subjectName: 'Operating Systems',
    topic: 'Virtual Memory Paging',
    intervalDays: 7,
    scheduledDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    status: 'pending',
  },
]

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'demo-student-id',
    title: 'Upcoming Study Session',
    message: 'Operating Systems: Process Synchronization starts at 10:05 AM.',
    type: 'session_reminder',
    isRead: false,
    scheduledFor: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'demo-student-id',
    title: 'Missed Session Detected',
    message: 'You missed "Red-Black Tree Rotations" yesterday. Click to auto-reschedule.',
    type: 'missed_session',
    isRead: false,
    scheduledFor: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'demo-student-id',
    title: 'Exam in 12 Days',
    message: 'Data Structures & Algorithms midterm countdown is active.',
    type: 'exam_alert',
    isRead: true,
    scheduledFor: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

// LocalStorage helpers
export const storage = {
  getProfile: (): StudentProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE)
      return data ? JSON.parse(data) : DEFAULT_PROFILE
    } catch {
      return DEFAULT_PROFILE
    }
  },
  setProfile: (profile: StudentProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
  },

  getSubjects: (): Subject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS)
      return data ? JSON.parse(data) : DEFAULT_SUBJECTS
    } catch {
      return DEFAULT_SUBJECTS
    }
  },
  setSubjects: (subjects: Subject[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects))
  },

  getExams: (): Exam[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS)
      return data ? JSON.parse(data) : DEFAULT_EXAMS
    } catch {
      return DEFAULT_EXAMS
    }
  },
  setExams: (exams: Exam[]) => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams))
  },

  getSessions: (): StudySession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS)
      return data ? JSON.parse(data) : DEFAULT_SESSIONS
    } catch {
      return DEFAULT_SESSIONS
    }
  },
  setSessions: (sessions: StudySession[]) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
  },

  getTasks: (): StudyTask[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS)
      return data ? JSON.parse(data) : DEFAULT_TASKS
    } catch {
      return DEFAULT_TASKS
    }
  },
  setTasks: (tasks: StudyTask[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  },

  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES)
      return data ? JSON.parse(data) : DEFAULT_NOTES
    } catch {
      return DEFAULT_NOTES
    }
  },
  setNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
  },

  getPomodoro: (): PomodoroSession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POMODORO)
      return data ? JSON.parse(data) : DEFAULT_POMODORO
    } catch {
      return DEFAULT_POMODORO
    }
  },
  setPomodoro: (sessions: PomodoroSession[]) => {
    localStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(sessions))
  },

  getRevision: (): RevisionRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION)
      return data ? JSON.parse(data) : DEFAULT_REVISIONS
    } catch {
      return DEFAULT_REVISIONS
    }
  },
  setRevision: (records: RevisionRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.REVISION, JSON.stringify(records))
  },

  getNotifications: (): AppNotification[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS
    } catch {
      return DEFAULT_NOTIFICATIONS
    }
  },
  setNotifications: (notifs: AppNotification[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs))
  },

  resetAll: () => {
    localStorage.clear()
  }
}
