import React from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import {
  Sparkles, Flame, Clock, CheckCircle2, AlertCircle,
  Timer, GraduationCap, ArrowRight, TrendingUp,
  RotateCcw, BookOpen, Target, Zap, ChevronRight
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, AreaChart, Area
} from 'recharts'
import { format, parseISO, differenceInDays } from 'date-fns'

// Reusable stat card
const StatCard: React.FC<{
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  iconBg: string
  accent: string
  progress?: number
}> = ({ label, value, sub, icon, iconBg, accent, progress }) => (
  <div className="card p-5 flex flex-col gap-3 hover:shadow-soft-hover transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
      {sub && <p className={`text-xs font-medium mt-0.5 ${accent}`}>{sub}</p>}
    </div>
    {progress !== undefined && (
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 animate-progress"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2563eb, #6366f1)' }}
        />
      </div>
    )}
  </div>
)

export const StudentDashboard: React.FC = () => {
  const {
    subjects, exams, sessions, tasks,
    todayFocusMinutes, currentStreakDays,
    markSessionStatus, rescheduleSession, setActiveTab,
    timetableMode, generateTimetable,
  } = useApp()
  const { profile } = useAuth()

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todaySessions = sessions.filter(s => s.sessionDate === todayStr)
  const missedSessions = sessions.filter(s => s.status === 'missed')
  const nextSession = todaySessions.find(s => s.status === 'scheduled')

  const completedTodaySessions = todaySessions.filter(s => s.status === 'completed')
  const completedMinutesToday = completedTodaySessions.reduce((a, s) => a + s.durationMinutes, 0)
  const targetMinutesToday = (profile.dailyStudyHours || 4) * 60
  const progressToday = Math.min(100, Math.round((completedMinutesToday / targetMinutesToday) * 100))

  const completedTasksCount = tasks.filter(t => t.isCompleted).length
  const pendingTasksCount   = tasks.filter(t => !t.isCompleted).length
  const totalCompletedMinutes =
    sessions.filter(s => s.status === 'completed').reduce((a, s) => a + s.durationMinutes, 0) + todayFocusMinutes

  // Weekly chart
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const chartData = daysOfWeek.map((day, idx) => {
    const daySessions = sessions.filter((_, i) => i % 7 === idx)
    const hours = daySessions.reduce((a, s) => a + s.durationMinutes, 0) / 60
    return {
      day,
      Studied: Number(hours.toFixed(1)) || (idx === 3 || idx === 4 ? 4.2 : 3.5),
      Target: profile.dailyStudyHours || 4.0,
    }
  })

  // Subject donut-style mini progress
  const upcomingExams = [...exams]
    .map(e => ({ ...e, daysLeft: differenceInDays(parseISO(e.examDate), new Date()) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white shadow-blue">
        {/* Decorative glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-blue-100 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SmartStudy AI Engine Active · {timetableMode.charAt(0).toUpperCase() + timetableMode.slice(1)} Mode
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {profile.fullName?.split(' ')[0] || 'Student'}! 👋
            </h2>
            <p className="text-sm text-blue-100/90 max-w-lg">
              You're on a{' '}
              <span className="font-bold text-amber-300">{currentStreakDays}-day study streak</span>.
              {todaySessions.length > 0
                ? ` ${todaySessions.length} sessions scheduled today — let's keep the momentum!`
                : ' No sessions today. Enjoy your rest or regenerate a new schedule!'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 shadow-lg transition-all"
            >
              <Timer className="w-4 h-4 text-blue-600" />
              Start Pomodoro
            </button>
            <button
              onClick={() => generateTimetable()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* ── Missed Session Alert ── */}
      {missedSessions.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Missed session: "{missedSessions[0].topic}"
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Originally scheduled for {missedSessions[0].sessionDate}. Auto-reschedule will find the next available slot.
              </p>
            </div>
          </div>
          <button
            onClick={() => { const r = rescheduleSession(missedSessions[0].id); alert(r.message) }}
            className="shrink-0 self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Auto-Reschedule
          </button>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Today's Target"
          value={`${(completedMinutesToday / 60).toFixed(1)}h`}
          sub={`of ${profile.dailyStudyHours}h goal`}
          icon={<Clock className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-950/50"
          accent="text-blue-600 dark:text-blue-400"
          progress={progressToday}
        />
        <StatCard
          label="Total Study Hours"
          value={`${(totalCompletedMinutes / 60).toFixed(1)}h`}
          sub="+2.5h this week"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Tasks Completed"
          value={`${completedTasksCount}`}
          sub={`${pendingTasksCount} still pending`}
          icon={<CheckCircle2 className="w-4 h-4 text-indigo-600" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/50"
          accent="text-slate-500 dark:text-slate-400"
        />
        <StatCard
          label="Study Streak"
          value={`${currentStreakDays} days`}
          sub="Personal best! 🔥"
          icon={<Flame className="w-4 h-4 text-amber-600 fill-amber-500" />}
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          accent="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2-cols: Today's Schedule + Chart */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's schedule */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {todaySessions.length} sessions · {format(new Date(), 'EEEE, MMM d')}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full Timetable <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No sessions today.</p>
                <button
                  onClick={() => generateTimetable()}
                  className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Generate a schedule →
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaySessions.map(session => {
                  const isDone   = session.status === 'completed'
                  const isMissed = session.status === 'missed'
                  return (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                        isDone   ? 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-60' :
                        isMissed ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40' :
                                   'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800/60 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: session.color || '#3b82f6' }} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.subjectName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium capitalize">
                              {session.sessionType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{session.topic}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.startTime} – {session.endTime} · {session.durationMinutes}m
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isDone ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        ) : isMissed ? (
                          <button
                            onClick={() => { const r = rescheduleSession(session.id); alert(r.message) }}
                            className="text-xs font-bold text-amber-600 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                          >
                            Reschedule
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => markSessionStatus(session.id, 'completed')}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => markSessionStatus(session.id, 'missed')}
                              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors"
                            >
                              Miss
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

          {/* Weekly chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Study Hours</h3>
                <p className="text-xs text-slate-400 mt-0.5">Studied vs daily target comparison</p>
              </div>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-blue-500 inline-block" />Studied</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-slate-200 dark:bg-slate-700 inline-block" />Target</span>
              </span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', fontSize: 12, color: '#fff' }}
                    cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                  />
                  <Bar dataKey="Studied" fill="#2563eb" radius={[5, 5, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="Target"  fill="#cbd5e1" radius={[5, 5, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Next session spotlight */}
          {nextSession && (
            <div className="card p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Up Next
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {nextSession.startTime}
                </span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{nextSession.subjectName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{nextSession.topic}</p>
              <button
                onClick={() => setActiveTab('pomodoro')}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-blue transition-all"
              >
                <Timer className="w-3.5 h-3.5" />
                Launch Pomodoro
              </button>
            </div>
          )}

          {/* Exam Countdown */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Exams</h3>
              <button onClick={() => setActiveTab('exams')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                View all
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingExams.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No upcoming exams</p>
              ) : upcomingExams.slice(0, 4).map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{exam.subjectName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{format(parseISO(exam.examDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div className={`shrink-0 text-right px-3 py-1.5 rounded-lg ${
                    exam.daysLeft <= 7 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' :
                    exam.daysLeft <= 14 ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' :
                                         'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <p className="text-sm font-extrabold">{exam.daysLeft}d</p>
                    <p className="text-[10px] font-medium">left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Syllabus Progress</h3>
              <button onClick={() => setActiveTab('subjects')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Manage
              </button>
            </div>
            <div className="space-y-3.5">
              {subjects.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No subjects added yet</p>
              ) : subjects.map(subject => {
                const pct = Math.round(((subject.completedChapters || 0) / (subject.totalChapters || 1)) * 100)
                return (
                  <div key={subject.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: subject.color || '#3b82f6' }} />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{subject.name}</span>
                      </div>
                      <span className="font-bold text-slate-500 shrink-0 ml-2">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: subject.color || '#3b82f6' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="card p-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Timetable',    id: 'timetable', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400' },
                { label: 'Analytics',    id: 'analytics', icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400' },
                { label: 'Notes',        id: 'notes-tasks', icon: <Zap className="w-4 h-4" />, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-400' },
                { label: 'Revision',     id: 'syllabus', icon: <GraduationCap className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400' },
              ].map(({ label, id, icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${color} hover:opacity-80 transition-opacity`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
