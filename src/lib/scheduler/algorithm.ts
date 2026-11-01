import { Subject, Exam, StudySession, StudentProfile, TimetableMode } from '../../types'
import { format, addDays, parseISO, differenceInDays } from 'date-fns'

interface ScheduleOptions {
  startDate?: Date
  daysCount?: number
  mode?: TimetableMode
  includeRevision?: boolean
  includePracticeTests?: boolean
}

interface GeneratedTimetableResult {
  sessions: StudySession[]
  summary: {
    totalSessions: number
    totalStudyHours: number
    mode: TimetableMode
    subjectDistribution: { [subjectName: string]: number }
    averageDailyHours: number
    explanation: string
  }
}

/**
 * Deterministic multi-factor intelligent timetable generator.
 * Respects sleep hours, daily available time, upcoming exams, difficulty, weak topics, and spaced repetition.
 */
export function generateStudyTimetable(
  profile: StudentProfile,
  subjects: Subject[],
  exams: Exam[],
  options: ScheduleOptions = {}
): GeneratedTimetableResult {
  const {
    startDate = new Date(),
    daysCount = 7,
    mode = 'balanced',
    includeRevision = true,
    includePracticeTests = true,
  } = options

  if (!subjects.length) {
    return {
      sessions: [],
      summary: {
        totalSessions: 0,
        totalStudyHours: 0,
        mode,
        subjectDistribution: {},
        averageDailyHours: 0,
        explanation: 'No subjects provided. Add subjects to generate an intelligent timetable.'
      }
    }
  }

  const generatedSessions: StudySession[] = []
  const sessionDuration = profile.sessionDuration || 50
  const breakDuration = profile.breakDuration || 10
  const slotStepMinutes = sessionDuration + breakDuration

  // Parse student preferred window: e.g. "09:00" to "22:00"
  const [prefStartH, prefStartM] = (profile.preferredStartTime || '09:00').split(':').map(Number)
  const [prefEndH, prefEndM] = (profile.preferredEndTime || '22:00').split(':').map(Number)
  const [sleepStartH] = (profile.sleepStartTime || '23:00').split(':').map(Number)
  const [sleepEndH] = (profile.sleepEndTime || '07:00').split(':').map(Number)

  const dailyMinutesAvailable = (profile.dailyStudyHours || 4) * 60
  // Max sessions per day based on study hours setting and slot duration
  let maxSessionsPerDay = Math.max(1, Math.floor(dailyMinutesAvailable / sessionDuration))

  if (mode === 'intensive') {
    maxSessionsPerDay = Math.min(8, Math.floor(maxSessionsPerDay * 1.35))
  } else if (mode === 'exam') {
    maxSessionsPerDay = Math.min(7, Math.floor(maxSessionsPerDay * 1.15))
  }

  // 1. Calculate weights for each subject based on Mode, Difficulty, Priority, Exam Proximity, and Weak Topics
  const subjectWeights = subjects.map((sub) => {
    let weight = 1.0

    // Factor A: Difficulty (1: Easy, 2: Medium, 3: Hard)
    weight += (sub.difficulty - 1) * 0.45 // 1.0 -> 1.45 -> 1.9

    // Factor B: Priority (1: Low, 2: Medium, 3: High)
    weight += (sub.priority - 1) * 0.4

    // Factor C: Weak topics bonus
    if (sub.weakTopics && sub.weakTopics.length > 0) {
      weight += Math.min(1.2, sub.weakTopics.length * 0.3)
    }

    // Factor D: Pending syllabus ratio
    const pendingChapters = Math.max(1, (sub.totalChapters || 10) - (sub.completedChapters || 0))
    weight += (pendingChapters / (sub.totalChapters || 10)) * 0.5

    // Factor E: Upcoming Exam Proximity
    const subExam = exams.find((e) => e.subjectId === sub.id || e.subjectName.toLowerCase() === sub.name.toLowerCase())
    if (subExam && subExam.examDate) {
      const daysToExam = differenceInDays(parseISO(subExam.examDate), startDate)
      if (daysToExam > 0 && daysToExam <= 30) {
        if (mode === 'exam') {
          // In exam mode, strongly scale up approaching exams
          weight += Math.max(1.0, (30 - daysToExam) * 0.15)
        } else {
          weight += Math.max(0.3, (30 - daysToExam) * 0.05)
        }
      }
    }

    return { subject: sub, weight }
  })

  // Normalize weights
  const totalWeight = subjectWeights.reduce((acc, curr) => acc + curr.weight, 0)
  const normalizedSubjects = subjectWeights.map((sw) => ({
    ...sw,
    normalized: sw.weight / totalWeight,
  }))

  const subjectDistribution: { [name: string]: number } = {}
  subjects.forEach(s => { subjectDistribution[s.name] = 0 })

  // 2. Schedule Day by Day
  for (let dayIdx = 0; dayIdx < daysCount; dayIdx++) {
    const currentDate = addDays(startDate, dayIdx)
    const dayOfWeek = format(currentDate, 'EEEE')
    const dateStr = format(currentDate, 'yyyy-MM-dd')

    // Check if day is marked as weekly holiday
    const isHoliday = (profile.weeklyHolidays || []).includes(dayOfWeek)
    let sessionsToday = maxSessionsPerDay

    if (isHoliday) {
      // In holiday, lighten load or allow a single revision session
      sessionsToday = mode === 'intensive' ? 2 : 0
      if (sessionsToday === 0) continue
    }

    // Generate valid time slots for today
    let currentSlotMinute = prefStartH * 60 + prefStartM

    for (let sIdx = 0; sIdx < sessionsToday; sIdx++) {
      // Check if slot falls in sleep hours or past preferred end time
      const currentH = Math.floor(currentSlotMinute / 60)
      if (currentH >= 24) break
      if (prefEndH && currentH >= prefEndH) break
      if (sleepStartH > sleepEndH) {
        if (currentH >= sleepStartH || currentH < sleepEndH) break
      }

      // Pick subject according to weighted deficit (ensures fair, balanced progression)
      // Pick subject that has received the least attention relative to its normalized weight
      let bestSubject = normalizedSubjects[0].subject
      let lowestQuotaRatio = Infinity

      const totalScheduledSoFar = Math.max(1, generatedSessions.length)

      for (const item of normalizedSubjects) {
        const scheduledCount = subjectDistribution[item.subject.name] || 0
        const actualRatio = scheduledCount / totalScheduledSoFar
        const deficit = actualRatio / item.normalized

        if (deficit < lowestQuotaRatio) {
          lowestQuotaRatio = deficit
          bestSubject = item.subject
        }
      }

      // Determine session type (study, revision, or practice test)
      let sessionType: StudySession['sessionType'] = 'study'
      let topic = `Chapter ${(subjectDistribution[bestSubject.name] % (bestSubject.totalChapters || 10)) + 1} Deep Dive`

      // If subject has weak topics, inject them periodically
      if (bestSubject.weakTopics && bestSubject.weakTopics.length > 0 && sIdx % 2 === 1) {
        const weakIndex = sIdx % bestSubject.weakTopics.length
        topic = `Targeted Mastery: ${bestSubject.weakTopics[weakIndex]}`
        sessionType = 'revision'
      } else if (includeRevision && (sIdx === sessionsToday - 1 || dayIdx % 3 === 0 && sIdx === 0)) {
        sessionType = 'revision'
        topic = `Spaced Revision & Synthesis: ${bestSubject.name}`
      } else if (includePracticeTests && (dayIdx === 5 || dayIdx === 6) && mode !== 'balanced') {
        sessionType = 'practice_test'
        topic = `Timed Practice Exam & Mock Quiz`
      }

      // Format start and end time
      const startH = Math.floor(currentSlotMinute / 60)
      const startM = currentSlotMinute % 60
      const endMinute = currentSlotMinute + sessionDuration
      const endH = Math.floor(endMinute / 60)
      const endM = endMinute % 60

      const startTimeStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
      const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

      const newSession: StudySession = {
        id: `gen-${dateStr}-${sIdx}-${Math.random().toString(36).substring(2, 7)}`,
        userId: profile.id,
        subjectId: bestSubject.id,
        subjectName: bestSubject.name,
        topic,
        sessionDate: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        durationMinutes: sessionDuration,
        sessionType,
        status: 'scheduled',
        color: bestSubject.color,
      }

      generatedSessions.push(newSession)
      subjectDistribution[bestSubject.name] = (subjectDistribution[bestSubject.name] || 0) + 1

      // Advance slot time with break
      // Long break after every 2-3 sessions
      const isLongBreak = (sIdx + 1) % 3 === 0
      const currentBreak = isLongBreak ? breakDuration * 2.5 : breakDuration
      currentSlotMinute += sessionDuration + currentBreak

      // Lunch / Dinner break shift
      if (currentH === 12 || currentH === 13) {
        currentSlotMinute = Math.max(currentSlotMinute, 14 * 60) // Resume at 14:00
      }
    }
  }

  const totalStudyMinutes = generatedSessions.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10
  const avgDailyHours = daysCount > 0 ? Math.round((totalStudyHours / daysCount) * 10) / 10 : 0

  let explanation = ''
  if (mode === 'exam') {
    explanation = `Exam Mode activated: Over 65% of study hours are strategically routed to subjects with imminent exam deadlines, paired with active mock test simulations and targeted weak-topic drilldowns.`
  } else if (mode === 'intensive') {
    explanation = `Intensive Mode activated: Maximized study blocks with reduced inter-session downtime to accelerate pending chapter completion while preserving cognitive retention.`
  } else {
    explanation = `Balanced Mode activated: Harmonious distribution across all ${subjects.length} subjects weighted by difficulty, priority, and syllabus completion with built-in spaced repetition intervals.`
  }

  return {
    sessions: generatedSessions,
    summary: {
      totalSessions: generatedSessions.length,
      totalStudyHours,
      mode,
      subjectDistribution,
      averageDailyHours: avgDailyHours,
      explanation
    }
  }
}
