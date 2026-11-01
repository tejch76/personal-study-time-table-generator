import { StudySession, StudentProfile, Exam } from '../../types'
import { format, addDays, parseISO, isBefore, isAfter, differenceInDays } from 'date-fns'

interface RescheduleResult {
  rescheduledSession: StudySession
  newDate: string
  newStartTime: string
  newEndTime: string
  message: string
}

/**
 * Finds the next available non-overlapping time slot for a missed study session,
 * strictly honoring student study hours, sleep window, and upcoming exam deadlines.
 */
export function rescheduleMissedSession(
  missedSession: StudySession,
  allSessions: StudySession[],
  profile: StudentProfile,
  exams: Exam[]
): RescheduleResult | null {
  const sessionDuration = missedSession.durationMinutes || profile.sessionDuration || 50
  const breakDuration = profile.breakDuration || 10
  const [prefStartH, prefStartM] = (profile.preferredStartTime || '09:00').split(':').map(Number)
  const [prefEndH] = (profile.preferredEndTime || '22:00').split(':').map(Number)

  // Find relevant exam deadline if any
  const relatedExam = exams.find(e => e.subjectId === missedSession.subjectId || e.subjectName === missedSession.subjectName)
  const examDeadline = relatedExam ? parseISO(relatedExam.examDate) : null

  const today = new Date()

  // Search over the next 14 days
  for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
    const candidateDate = addDays(today, dayOffset)
    const dateStr = format(candidateDate, 'yyyy-MM-dd')

    // Don't reschedule past the exam date
    if (examDeadline && isAfter(candidateDate, examDeadline)) {
      continue
    }

    // Get all existing active sessions on candidate date
    const daySessions = allSessions.filter(
      s => s.sessionDate === dateStr && s.status !== 'missed' && s.id !== missedSession.id
    )

    // Sort by start time
    daySessions.sort((a, b) => a.startTime.localeCompare(b.startTime))

    // Candidate starting minute for search: either preferred start time or current time if today
    let candidateMinute = prefStartH * 60 + prefStartM

    if (dayOffset === 0) {
      // If looking at today, start after current hour + 30 mins
      const currentH = today.getHours()
      const currentM = today.getMinutes()
      const currentTotalMin = currentH * 60 + currentM + 15
      candidateMinute = Math.max(candidateMinute, Math.ceil(currentTotalMin / 15) * 15)
    }

    // Step through candidate day until preferred end time
    while (candidateMinute + sessionDuration <= (prefEndH || 22) * 60) {
      const slotStart = candidateMinute
      const slotEnd = candidateMinute + sessionDuration

      // Check collision with existing sessions
      const hasConflict = daySessions.some(s => {
        const [sStartH, sStartM] = s.startTime.split(':').map(Number)
        const [sEndH, sEndM] = s.endTime.split(':').map(Number)
        const sStart = sStartH * 60 + sStartM
        const sEnd = sEndH * 60 + sEndM

        // Buffer with break
        return (slotStart < sEnd + breakDuration) && (slotEnd > sStart - breakDuration)
      })

      if (!hasConflict) {
        // Free slot found!
        const startH = Math.floor(slotStart / 60)
        const startM = slotStart % 60
        const endH = Math.floor(slotEnd / 60)
        const endM = slotEnd % 60

        const newStartTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
        const newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

        const rescheduledSession: StudySession = {
          ...missedSession,
          id: `resched-${Date.now()}`,
          sessionDate: dateStr,
          startTime: newStartTime,
          endTime: newEndTime,
          status: 'scheduled',
          rescheduledFrom: missedSession.id,
          notes: `Rescheduled from ${missedSession.sessionDate} (${missedSession.startTime})`,
        }

        const dayDesc = dayOffset === 0 ? 'today' : dayOffset === 1 ? 'tomorrow' : `on ${format(candidateDate, 'EEEE, MMM d')}`

        return {
          rescheduledSession,
          newDate: dateStr,
          newStartTime,
          newEndTime,
          message: `Successfully relocated "${missedSession.topic}" to ${dayDesc} at ${newStartTime} – ${newEndTime} without conflicts.`,
        }
      }

      // Increment slot candidate by 15-minute increments
      candidateMinute += 15
    }
  }

  return null
}
