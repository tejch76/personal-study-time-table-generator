import React from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  GraduationCap,
  Timer,
  Repeat,
  BarChart3,
  CheckSquare,
  Settings,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  X
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, sessions, isDarkMode, toggleTheme } = useApp()
  const { profile, logout } = useAuth()

  const missedCount = sessions.filter(s => s.status === 'missed').length

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays, badge: missedCount > 0 ? `${missedCount} missed` : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'exams', label: 'Exams & Countdown', icon: GraduationCap },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer },
    { id: 'syllabus', label: 'Revision Tracker', icon: Repeat },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notes-tasks', label: 'Notes & Tasks', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleNavClick = (id: string) => {
    setActiveTab(id)
    onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  SmartStudy
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Personal Study Timetable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-indigo-900/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom student user widget & quick actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                {profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {profile.fullName}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {profile.degree || 'Computer Science'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
