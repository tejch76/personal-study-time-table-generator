import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import {
  GraduationCap,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
  Coffee,
  Moon
} from 'lucide-react'

export const OnboardingWizard: React.FC = () => {
  const { profile, completeOnboarding } = useAuth()
  const { generateTimetable } = useApp()
  const [step, setStep] = useState<number>(1)

  // Step 1: Academic Identity
  const [college, setCollege] = useState(profile.college || 'Stanford University / MIT')
  const [degree, setDegree] = useState(profile.degree || 'Bachelor of Science')
  const [department, setDepartment] = useState(profile.department || 'Computer Science & Engineering')
  const [semester, setSemester] = useState(profile.semester || 'Semester 5 (Year 3)')
  const [targetCgpa, setTargetCgpa] = useState<number>(profile.targetCgpa || 9.2)

  // Step 2: Time & Routine
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(profile.dailyStudyHours || 4.5)
  const [preferredStartTime, setPreferredStartTime] = useState(profile.preferredStartTime || '09:00')
  const [preferredEndTime, setPreferredEndTime] = useState(profile.preferredEndTime || '21:30')
  const [sleepStartTime, setSleepStartTime] = useState(profile.sleepStartTime || '23:30')
  const [sleepEndTime, setSleepEndTime] = useState(profile.sleepEndTime || '07:00')

  // Step 3: Focus & Holidays
  const [sessionDuration, setSessionDuration] = useState<number>(profile.sessionDuration || 50)
  const [breakDuration, setBreakDuration] = useState<number>(profile.breakDuration || 10)
  const [weeklyHolidays, setWeeklyHolidays] = useState<string[]>(profile.weeklyHolidays || ['Sunday'])

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleHoliday = (day: string) => {
    if (weeklyHolidays.includes(day)) {
      setWeeklyHolidays(weeklyHolidays.filter(d => d !== day))
    } else {
      setWeeklyHolidays([...weeklyHolidays, day])
    }
  }

  const handleFinish = () => {
    completeOnboarding({
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
      weeklyHolidays,
    })
    generateTimetable('balanced')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30">
                {step}/3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Setup Wizard
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {step === 1 && 'Academic Profile'}
              {step === 2 && 'Daily Schedule & Routine'}
              {step === 3 && 'Focus & Break Preferences'}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Academic Identity */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Tell us about your academic goals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                SmartStudy AI personalizes your timetable based on your curriculum intensity and targets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College or University Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Degree Program
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech / B.S."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Semester / Year
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  placeholder="e.g. Semester 5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target CGPA / GPA Goal (out of 10 or 4)
                </label>
                <input
                  type="number"
                  step="0.1"
                  max="10"
                  min="1"
                  value={targetCgpa}
                  onChange={e => setTargetCgpa(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 9.0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Time & Routine */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Configure your daily study window
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We safeguard your sleep hours and only schedule sessions during your peak energy hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Daily Study Target: <span className="text-indigo-600 font-bold">{dailyStudyHours} hours</span>
                  </label>
                  <span className="text-xs text-slate-500">Realistic pace: 3-5 hrs</span>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Study Start Time
                  </label>
                  <input
                    type="time"
                    value={preferredStartTime}
                    onChange={e => setPreferredStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Study End Time
                  </label>
                  <input
                    type="time"
                    value={preferredEndTime}
                    onChange={e => setPreferredEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sleep Start (Bedtime)
                  </label>
                  <input
                    type="time"
                    value={sleepStartTime}
                    onChange={e => setSleepStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Wake Up Time
                  </label>
                  <input
                    type="time"
                    value={sleepEndTime}
                    onChange={e => setSleepEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Focus & Break Preferences */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Pacing & Weekly Rest
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Consistent short breaks dramatically enhance long-term memory consolidation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Session Duration
                </label>
                <div className="flex gap-2">
                  {[25, 50, 90].map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSessionDuration(dur)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        sessionDuration === dur
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {dur} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Break Duration
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15].map(brk => (
                    <button
                      key={brk}
                      type="button"
                      onClick={() => setBreakDuration(brk)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        breakDuration === brk
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {brk} mins
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Weekly Rest Days / Holidays
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => {
                  const isSelected = weeklyHolidays.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleHoliday(day)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Timetable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
