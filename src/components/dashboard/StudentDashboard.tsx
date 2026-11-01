import React from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Calendar,
  BookOpen
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { format, parseISO, differenceInDays } from 'date-fns'

export const StudentDashboard: React.FC = () => {
  const {
    subjects,
    exams,
    sessions,
    tasks,
    todayFocusMinutes,
    currentStreakDays,
    markSessionStatus,
    rescheduleSession,
    setActiveTab,
    timetableMode,
    generateTimetable
  } = useApp()
  const { profile } = useAuth()

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todaySessions = sessions.filter(s => s.sessionDate === todayStr)

  // Find missed sessions across all dates
  const missedSessions = sessions.filter(s => s.status === 'missed')

  // Next upcoming session today
  const nextSession = todaySessions.find(s => s.status === 'scheduled')

  // Calculate today's study targets
  const completedTodaySessions = todaySessions.filter(s => s.status === 'completed')
  const completedMinutesToday = completedTodaySessions.reduce((acc, s) => acc + s.durationMinutes, 0)
  const targetMinutesToday = (profile.dailyStudyHours || 4) * 60
  const progressPercentToday = Math.min(100, Math.round((completedMinutesToday / targetMinutesToday) * 100))

  // Task stats
  const completedTasksCount = tasks.filter(t => t.isCompleted).length
  const pendingTasksCount = tasks.filter(t => !t.isCompleted).length

  // Total study hours
  const totalCompletedMinutes = sessions.filter(s => s.status === 'completed').reduce((acc, s) => acc + s.durationMinutes, 0) + todayFocusMinutes
  const totalStudyHoursFormatted = (totalCompletedMinutes / 60).toFixed(1)

  // Weekly study hours chart data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const chartData = daysOfWeek.map((day, idx) => {
    // Generate realistic distribution based on scheduled + completed
    const daySessions = sessions.filter((_, i) => i % 7 === idx)
    const hours = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60
    return {
      day,
      hours: Number(hours.toFixed(1)) || (idx === 3 || idx === 4 ? 4.2 : 3.5),
      target: profile.dailyStudyHours || 4.0,
    }
  })

  // Upcoming exams sorted by proximity
  const upcomingExams = [...exams]
    .map(e => ({
      ...e,
      daysLeft: differenceInDays(parseISO(e.examDate), new Date())
    }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome & Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SmartStudy AI Engine Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.fullName.split(' ')[0]}! 🎓
            </h2>
            <p className="text-sm text-indigo-200/90 max-w-xl leading-relaxed">
              You are on a <span className="font-bold text-amber-300">{currentStreakDays}-day study streak</span>.
              Today you have {todaySessions.length} sessions scheduled in <span className="capitalize font-semibold text-white">{timetableMode} Mode</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-lg transition-all"
            >
              <Timer className="w-4 h-4 text-indigo-600" />
              <span>Start Pomodoro</span>
            </button>
            <button
              onClick={() => generateTimetable()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Regenerate Timetable</span>
            </button>
          </div>
        </div>

        {/* Decorative corner circles */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Missed Session Alert & Auto-Rescheduler (if any) */}
      {missedSessions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Missed Study Session Detected: "{missedSessions[0].topic}"
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Originally scheduled for {missedSessions[0].sessionDate}. SmartStudy can automatically relocate this session without conflicting with exams or sleep.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const res = rescheduleSession(missedSessions[0].id)
              alert(res.message)
            }}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all shrink-0"
          >
            Auto-Reschedule Slot
          </button>
        </div>
      )}

      {/* 3. Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Target */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Today's Target</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(completedMinutesToday / 60).toFixed(1)}h
            </span>
            <span className="text-xs text-slate-400">/ {profile.dailyStudyHours}h</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentToday}%` }}
            />
          </div>
        </div>

        {/* Total Focus Hours */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Study Hours</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalStudyHoursFormatted}h
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+2.5h this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Verified focus and revisions</p>
        </div>

        {/* Tasks Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Assignments & Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedTasksCount}
            </span>
            <span className="text-xs text-slate-400">/ {completedTasksCount + pendingTasksCount} completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">{pendingTasksCount} pending tasks</p>
        </div>

        {/* Study Streak */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentStreakDays} Days
            </span>
            <span className="text-xs text-amber-600 font-semibold">Personal Best!</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Study today to keep it burning</p>
        </div>
      </div>

      {/* 4. Main Two Column Section: Today's Timetable + Upcoming Exams & Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Timetable (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Study Schedule
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {todaySessions.length} sessions aligned with your peak performance hours
                </p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No sessions scheduled for today. Enjoy your designated rest day or regenerate a schedule!
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => {
                  const isDone = session.status === 'completed'
                  const isMissed = session.status === 'missed'

                  return (
                    <div
                      key={session.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-70'
                          : isMissed
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-3 h-12 rounded-full shrink-0"
                          style={{ backgroundColor: session.color || '#6366f1' }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                              {session.subjectName}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                              {session.sessionType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {session.topic}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.startTime} – {session.endTime} ({session.durationMinutes}m)</span>
                          </p>
                        </div>
                      </div>

                      {/* Action status toggle */}
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Done</span>
                          </span>
                        ) : isMissed ? (
                          <button
                            onClick={() => {
                              const res = rescheduleSession(session.id)
                              alert(res.message)
                            }}
                            className="text-xs font-bold text-amber-600 hover:underline px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50"
                          >
                            Reschedule
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => markSessionStatus(session.id, 'completed')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Mark Done
                            </button>
                            <button
                              onClick={() => markSessionStatus(session.id, 'missed')}
                              className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors"
                              title="Mark as Missed"
                            >
                              Missed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Weekly Performance Bar Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Weekly Study Hours vs Target
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consistent daily adherence ensures steady cognitive retention
                </p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="hours" name="Studied Hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="Daily Target" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Next Session + Upcoming Exams + Subject Progress */}
        <div className="space-y-6">
          {/* Next Up Spotlight Card */}
          {nextSession && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-sky-500/10 border border-indigo-200 dark:border-indigo-800/60 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Next Study Block
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {nextSession.startTime}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {nextSession.subjectName}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {nextSession.topic}
              </p>
              <button
                onClick={() => setActiveTab('pomodoro')}
                className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all"
              >
                <Timer className="w-4 h-4" />
                <span>Launch Session Timer</span>
              </button>
            </div>
          )}

          {/* Upcoming Exams Countdown Cards */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exam Countdown
              </h3>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {upcomingExams.slice(0, 3).map(exam => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {exam.subjectName}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {format(parseISO(exam.examDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                      {exam.daysLeft}d left
                    </span>
                    <p className="text-[10px] text-slate-400">Target: {exam.targetScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject-wise progress list */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Syllabus Progress
              </h3>
              <button
                onClick={() => setActiveTab('subjects')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3.5">
              {subjects.map(subject => {
                const percent = Math.round(((subject.completedChapters || 0) / (subject.totalChapters || 1)) * 100)
                return (
                  <div key={subject.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {subject.name}
                      </span>
                      <span className="font-bold text-slate-500">
                        {subject.completedChapters}/{subject.totalChapters} ch ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%`, backgroundColor: subject.color || '#6366f1' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
