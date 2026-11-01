import React, { useState } from 'react'
import {
  Menu,
  Bell,
  Flame,
  Timer,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  onToggleSidebar: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    todayFocusMinutes,
    currentStreakDays
  } = useApp()
  const { profile } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Student Dashboard'
      case 'timetable': return 'Personal Timetable'
      case 'subjects': return 'Subject & Syllabus Management'
      case 'exams': return 'Examination Countdown'
      case 'pomodoro': return 'Pomodoro Focus Timer'
      case 'syllabus': return 'Spaced Revision Tracker'
      case 'analytics': return 'Productivity & Analytics'
      case 'notes-tasks': return 'Notes & Task Management'
      case 'settings': return 'Preferences & Settings'
      default: return 'SmartStudy AI'
    }
  }

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak indicator badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs cursor-pointer shadow-sm"
          title="Daily Study Streak"
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>{currentStreakDays} Day Streak</span>
        </div>

        {/* Quick Pomodoro Launcher Button */}
        <button
          onClick={() => setActiveTab('pomodoro')}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold transition-all duration-200"
          title="Launch Pomodoro Timer"
        >
          <Timer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{todayFocusMinutes}m Focus Today</span>
        </button>

        {/* Notification Bell & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {notif.type === 'missed_session' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : notif.type === 'exam_alert' ? (
                            <Clock className="w-4 h-4 text-rose-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
