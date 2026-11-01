import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import {
  Settings,
  User,
  Clock,
  Bell,
  Moon,
  Sun,
  Lock,
  Globe,
  Save,
  LogOut,
  Trash2,
  CheckCircle2
} from 'lucide-react'
import { requestNotificationPermission } from '../../lib/notifications'

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useApp()

  const [fullName, setFullName] = useState(profile.fullName)
  const [college, setCollege] = useState(profile.college)
  const [degree, setDegree] = useState(profile.degree)
  const [department, setDepartment] = useState(profile.department)
  const [semester, setSemester] = useState(profile.semester)
  const [targetCgpa, setTargetCgpa] = useState(profile.targetCgpa)

  const [dailyStudyHours, setDailyStudyHours] = useState(profile.dailyStudyHours)
  const [preferredStartTime, setPreferredStartTime] = useState(profile.preferredStartTime)
  const [preferredEndTime, setPreferredEndTime] = useState(profile.preferredEndTime)
  const [sleepStartTime, setSleepStartTime] = useState(profile.sleepStartTime)
  const [sleepEndTime, setSleepEndTime] = useState(profile.sleepEndTime)
  const [sessionDuration, setSessionDuration] = useState(profile.sessionDuration)
  const [breakDuration, setBreakDuration] = useState(profile.breakDuration)
  const [timezone, setTimezone] = useState(profile.timezone)

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [notifGranted, setNotifGranted] = useState(
    'Notification' in window && Notification.permission === 'granted'
  )

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      fullName,
      college,
      degree,
      department,
      semester,
      targetCgpa,
      dailyStudyHours,
      preferredStartTime,
      preferredEndTime,
      sleepStartTime,
      sleepEndTime,
      sessionDuration,
      breakDuration,
      timezone,
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotifGranted(granted)
    if (granted) {
      alert('Browser notifications enabled successfully!')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Preferences & Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalize your timetable constraints, sleep schedule, and notifications.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Academic Identity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Student Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University / College
              </label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree & Branch
              </label>
              <input
                type="text"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target CGPA / GPA
              </label>
              <input
                type="number"
                step="0.1"
                value={targetCgpa}
                onChange={e => setTargetCgpa(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Study Constraints & Routines */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Study Window & Sleep Guard</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Study Hours ({dailyStudyHours}h)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={dailyStudyHours}
                onChange={e => setDailyStudyHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Study Window Start
              </label>
              <input
                type="time"
                value={preferredStartTime}
                onChange={e => setPreferredStartTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Study Window End
              </label>
              <input
                type="time"
                value={preferredEndTime}
                onChange={e => setPreferredEndTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bedtime (Sleep Start)
              </label>
              <input
                type="time"
                value={sleepStartTime}
                onChange={e => setSleepStartTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Wake Up Time (Sleep End)
              </label>
              <input
                type="time"
                value={sleepEndTime}
                onChange={e => setSleepEndTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Notifications & System Preferences */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span>Reminders & Interface</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Browser Web Notifications
              </h4>
              <p className="text-[11px] text-slate-400">
                Receive proactive reminders before upcoming study blocks and Pomodoro breaks.
              </p>
            </div>
            <button
              type="button"
              onClick={handleEnableNotifications}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                notifGranted
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {notifGranted ? 'Enabled ✓' : 'Enable Notifications'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Visual Theme
              </h4>
              <p className="text-[11px] text-slate-400">
                Toggle between academic light mode and high-contrast dark mode.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </form>
    </div>
  )
}
