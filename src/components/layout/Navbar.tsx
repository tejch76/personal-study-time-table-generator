import React, { useState } from 'react'
import {
  Menu, Bell, Flame, Timer, AlertTriangle, Clock,
  CheckCircle2, X, Search, GraduationCap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  onToggleSidebar: () => void
}

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  dashboard:   { title: 'Dashboard',              sub: 'Your daily study overview' },
  timetable:   { title: 'Timetable',              sub: 'AI-generated study schedule' },
  subjects:    { title: 'Subjects',               sub: 'Manage syllabus & chapters' },
  exams:       { title: 'Exams & Countdown',      sub: 'Track exam readiness' },
  pomodoro:    { title: 'Pomodoro Timer',          sub: 'Deep focus sessions' },
  syllabus:    { title: 'Revision Tracker',        sub: 'Spaced repetition schedule' },
  analytics:   { title: 'Analytics',              sub: 'Productivity insights' },
  'notes-tasks': { title: 'Notes & Tasks',        sub: 'Assignments & reminders' },
  settings:    { title: 'Settings',               sub: 'Preferences & account' },
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    activeTab, setActiveTab, notifications,
    markNotificationAsRead, clearAllNotifications,
    todayFocusMinutes, currentStreakDays,
  } = useApp()
  const { profile } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const page = PAGE_TITLES[activeTab] ?? { title: 'SmartStudy AI', sub: '' }

  const initials = profile.fullName
    ? profile.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ST'

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">

      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
            {page.title}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate hidden sm:block">
            {page.sub}
          </p>
        </div>
      </div>

      {/* Right: quick actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Streak badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {currentStreakDays} day streak
        </div>

        {/* Focus minutes */}
        <button
          onClick={() => setActiveTab('pomodoro')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          title="Pomodoro Timer"
        >
          <Timer className="w-3.5 h-3.5" />
          {todayFocusMinutes}m today
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >Clear all</button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'missed_session' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : notif.type === 'exam_alert' ? (
                            <Clock className="w-4 h-4 text-rose-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner cursor-default ml-1">
          {initials}
        </div>
      </div>
    </header>
  )
}
