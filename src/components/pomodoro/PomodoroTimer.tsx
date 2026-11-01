import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  History,
  CheckCircle2
} from 'lucide-react'
import { playChime, sendBrowserNotification } from '../../lib/notifications'
import { format } from 'date-fns'

type TimerMode = 'pomodoro_25' | 'short_break' | 'deep_50' | 'long_break' | 'custom'

export const PomodoroTimer: React.FC = () => {
  const {
    subjects,
    recordPomodoroSession,
    pomodoroSessions,
    todayFocusMinutes
  } = useApp()

  const [mode, setMode] = useState<TimerMode>('pomodoro_25')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '')
  const [customMinutes, setCustomMinutes] = useState<number>(30)

  // Durations in seconds
  const getInitialSeconds = (currentMode: TimerMode): number => {
    switch (currentMode) {
      case 'pomodoro_25': return 25 * 60
      case 'short_break': return 5 * 60
      case 'deep_50': return 50 * 60
      case 'long_break': return 10 * 60
      case 'custom': return customMinutes * 60
      default: return 25 * 60
    }
  }

  const [timeLeft, setTimeLeft] = useState<number>(() => getInitialSeconds('pomodoro_25'))
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const timerRef = useRef<any>(null)

  const isBreak = mode === 'short_break' || mode === 'long_break'

  // Change mode handler
  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false)
    clearInterval(timerRef.current)
    setMode(newMode)
    setTimeLeft(getInitialSeconds(newMode))
  }

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsRunning(false)
            handleSessionCompleted()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, mode, selectedSubjectId])

  const handleSessionCompleted = () => {
    const isStudy = !isBreak
    if (isStudy) {
      const durationMin = Math.round(getInitialSeconds(mode) / 60)
      const sub = subjects.find(s => s.id === selectedSubjectId)
      recordPomodoroSession(
        durationMin,
        mode === 'deep_50' ? 'deep_50' : mode === 'custom' ? 'custom' : 'pomodoro_25',
        sub?.id,
        sub?.name || 'Self Study'
      )
      playChime('complete')
      sendBrowserNotification('Pomodoro Session Complete! 🎯', {
        body: `Splendid job! You completed ${durationMin} minutes of focused study. Take a well-earned break!`,
      })
    } else {
      playChime('break')
      sendBrowserNotification('Break Finished! ⏰', {
        body: 'Break has ended. Ready to jump into the next focus session?',
      })
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    clearInterval(timerRef.current)
    setTimeLeft(getInitialSeconds(mode))
  }

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Progress percentage
  const totalSeconds = getInitialSeconds(mode)
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100)

  // Total sessions completed today
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const completedToday = pomodoroSessions.filter(p => p.completedAt.startsWith(todayStr)).length

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Pomodoro Focus Timer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Harness timeboxing and cognitive rest cycles to eliminate procrastination and maintain peak focus.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-center">
            <span className="text-[10px] font-bold uppercase text-indigo-500 block">Today's Focus</span>
            <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-300">
              {todayFocusMinutes} mins
            </span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-500 block">Completed</span>
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">
              {completedToday} cycles
            </span>
          </div>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-soft text-center relative overflow-hidden">
        {/* Glow */}
        <div
          className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isBreak ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
          }`}
        />

        {/* Mode Selector Buttons */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8">
          <button
            onClick={() => handleModeChange('pomodoro_25')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'pomodoro_25'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => handleModeChange('deep_50')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'deep_50'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            50m Deep Focus
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            10m Long Break
          </button>
          <button
            onClick={() => handleModeChange('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'custom'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Subject association dropdown */}
        {!isBreak && subjects.length > 0 && (
          <div className="max-w-xs mx-auto mb-8">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Current Focus Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 text-center"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Circular Display / Big Digits */}
        <div className="relative my-8">
          <div className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white tabular-nums">
            {timeFormatted}
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">
            {isBreak ? '☕ Rest & Refresh' : '🔥 Focus In Progress'}
          </p>

          {/* Progress Line */}
          <div className="w-64 mx-auto h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBreak ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-extrabold text-sm shadow-xl transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : isBreak
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Completed Sessions
          </h3>
        </div>

        {pomodoroSessions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No completed sessions recorded yet. Start your first session above!
          </p>
        ) : (
          <div className="space-y-2.5">
            {pomodoroSessions.slice(0, 5).map(session => (
              <div
                key={session.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {session.subjectName || 'Study Session'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {format(new Date(session.completedAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  +{session.durationMinutes} mins
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
