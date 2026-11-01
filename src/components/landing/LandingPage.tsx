import React, { useState, useEffect } from 'react'
import {
  Sparkles, CalendarDays, Brain, Timer, Repeat, BarChart3,
  CheckCircle2, ArrowRight, Star, Moon, Sun, BookOpen,
  Zap, Shield, Download, ChevronRight, GraduationCap,
  Target, Clock, TrendingUp, Users, Play
} from 'lucide-react'
import { AuthModal } from '../auth/AuthModal'
import { useApp } from '../../context/AppContext'

const FEATURES = [
  {
    icon: Brain,
    color: 'blue',
    title: 'AI-Powered Scheduler',
    desc: 'Gemini AI analyzes your syllabus, difficulty levels, and exam proximity to build a mathematically optimized daily plan tailored to your cognitive patterns.',
  },
  {
    icon: Repeat,
    color: 'indigo',
    title: 'Spaced Repetition Engine',
    desc: 'Automatically schedules review sessions at 1, 3, 7, and 14-day intervals to defeat the Ebbinghaus forgetting curve and maximize long-term retention.',
  },
  {
    icon: CalendarDays,
    color: 'violet',
    title: 'Smart Auto-Rescheduling',
    desc: 'Missed a session? SmartStudy detects conflicts and instantly relocates your tasks to the next optimal free slot — no manual reshuffling needed.',
  },
  {
    icon: Timer,
    color: 'rose',
    title: 'Pomodoro Focus Timer',
    desc: '25m & 50m deep-work timers with synthesized audio chimes, browser push notifications, and automatic session logging to your daily study log.',
  },
  {
    icon: BarChart3,
    color: 'emerald',
    title: 'Analytics & Insights',
    desc: 'Interactive Recharts dashboards showing weekly study hours, subject distribution, consistency scores, and productivity trends over time.',
  },
  {
    icon: Download,
    color: 'amber',
    title: 'PDF & CSV Export',
    desc: 'One-click export of your weekly timetable to a beautifully formatted PDF or spreadsheet-ready CSV for printing or calendar import.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Build Your Academic Profile',
    desc: 'Add your subjects, chapters, difficulty levels, weak topics, and upcoming exam dates in our guided onboarding wizard.',
    icon: GraduationCap,
  },
  {
    num: '02',
    title: 'Generate Your Smart Schedule',
    desc: 'Our constraint-satisfaction engine slices subjects into optimal study blocks using urgency, difficulty, and syllabus weights.',
    icon: Target,
  },
  {
    num: '03',
    title: 'Study, Track & Adapt',
    desc: 'Use the integrated Pomodoro timer, mark sessions done, and let the auto-rescheduler handle any plan disruptions automatically.',
    icon: TrendingUp,
  },
]

const TESTIMONIALS = [
  {
    quote: 'The auto-rescheduling feature alone saved my semester. When an unexpected lab report came up, SmartStudy relocated my DSA revision without ruining my exam readiness.',
    name: 'Sarah Jenkins',
    role: 'Computer Science, Stanford University',
    initials: 'SJ',
    color: 'from-blue-500 to-blue-600',
  },
  {
    quote: 'Spaced repetition locked Operating System algorithms into my permanent memory. My GPA jumped from 3.2 to 3.85 in one academic quarter.',
    name: 'Marcus Chen',
    role: 'Electrical & Computer Engineering',
    initials: 'MC',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    quote: 'The Pomodoro timer tied directly to today\'s timetable kept me accountable. Exporting the weekly schedule as PDF made sticking to it effortless.',
    name: 'Priya Patel',
    role: 'Biomedical Engineering, IIT Bombay',
    initials: 'PP',
    color: 'from-rose-500 to-pink-600',
  },
]

const STATS = [
  { value: '10,000+', label: 'Students Using SmartStudy' },
  { value: '94%', label: 'Report Better Exam Scores' },
  { value: '3.2×', label: 'More Consistent Study Habits' },
  { value: '< 2 min', label: 'To Generate First Timetable' },
]

const COLOR_MAP: Record<string, { bg: string; icon: string; border: string }> = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-950/40',    icon: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-100 dark:border-blue-900/50' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/50' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/40', icon: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/50' },
  rose:   { bg: 'bg-rose-50 dark:bg-rose-950/40',    icon: 'text-rose-600 dark:text-rose-400',   border: 'border-rose-100 dark:border-rose-900/50' },
  emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/50' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-950/40',  icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/50' },
}

export const LandingPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useApp()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openRegister = () => { setAuthMode('register'); setAuthModalOpen(true) }
  const openLogin    = () => { setAuthMode('login');    setAuthModalOpen(true) }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* ── Navigation ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-sm'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-blue text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">SmartStudy</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">AI</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            {['Features', 'How It Works', 'Testimonials'].map(label => (
              <a key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >{label}</a>
            ))}
          </nav>

          {/* CTA group */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={openLogin}
              className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >Sign In</button>
            <button onClick={openRegister}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 hero-bg overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-100/60 dark:from-blue-950/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-8 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Google Gemini AI · Free for Students</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
              Study Smarter,{' '}
              <span className="gradient-text">Not Harder</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              SmartStudy AI transforms your subjects, chapters, and exam dates into a
              perfectly balanced daily study timetable — with spaced repetition,
              auto-rescheduling, and Pomodoro focus built in.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <button onClick={openRegister}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Free — No Credit Card
              </button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-soft"
              >
                Explore Features
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              {[
                'No credit card required',
                'Works offline with localStorage',
                'Export to PDF & CSV',
              ].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="ml-4 flex-1 max-w-xs bg-slate-100 dark:bg-slate-800 rounded-md px-4 py-1 text-xs text-slate-400 font-mono truncate">
                  smartstudy-ai.vercel.app/dashboard
                </div>
                <span className="ml-auto text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                  ● Live
                </span>
              </div>

              {/* Fake dashboard preview */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Today's Target",  value: '3.5h / 4.5h',  color: 'blue',   pct: 78 },
                  { label: 'Exam Countdown',  value: '12 Days',       color: 'rose',   pct: 65 },
                  { label: 'Study Streak',    value: '14 Days 🔥',    color: 'amber',  pct: 90 },
                  { label: 'Tasks Done',      value: '8 / 12',        color: 'emerald',pct: 67 },
                ].map(({ label, value, color, pct }) => (
                  <div key={label} className={`p-4 rounded-xl border ${
                    color === 'blue'    ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40' :
                    color === 'rose'    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40' :
                    color === 'amber'   ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40' :
                                         'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40'
                  }`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white">{value}</p>
                    <div className="mt-2 h-1 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        color === 'blue'    ? 'bg-blue-500' :
                        color === 'rose'    ? 'bg-rose-500' :
                        color === 'amber'   ? 'bg-amber-500' :
                                             'bg-emerald-500'
                      }`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample schedule rows */}
              <div className="px-6 pb-6 space-y-2">
                {[
                  { time: '08:00 – 09:30', subj: 'Data Structures', topic: 'Graph Algorithms – BFS & DFS', type: 'Study', color: '#3b82f6', done: true },
                  { time: '09:45 – 10:45', subj: 'Mathematics',     topic: 'Linear Algebra – Eigenvalues',  type: 'Revision', color: '#8b5cf6', done: false },
                  { time: '11:00 – 12:00', subj: 'Computer Networks', topic: 'TCP/IP Protocol Stack',       type: 'Study', color: '#10b981', done: false },
                ].map(s => (
                  <div key={s.time} className={`flex items-center gap-4 p-3.5 rounded-xl border ${
                    s.done
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="w-1 h-9 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.subj}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">{s.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.topic}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{s.time}</span>
                    {s.done
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              Intelligent Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Engineered for Academic Excellence
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Every feature is backed by cognitive science principles to maximize retention, efficiency, and exam readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => {
              const c = COLOR_MAP[color]
              return (
                <div key={title}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Simple 3-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              From Profile to Perfect Schedule
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Get your first AI-generated timetable in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-600 dark:to-blue-900" />

            {STEPS.map(({ num, title, desc, icon: Icon }) => (
              <div key={num} className="relative text-center flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-blue mb-6 z-10">
                  <Icon className="w-7 h-7 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 flex items-center justify-center text-[10px] font-black text-blue-600">
                    {num.replace('0', '')}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={openRegister}
              className="btn-primary text-base px-8 py-3.5 shadow-blue"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-4">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              Student Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Loved by High-Achieving Students
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              * Representative testimonials from beta evaluation participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, initials, color }) => (
              <div key={name}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-hover transition-all duration-200 flex flex-col gap-4"
              >
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed flex-1">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{name}</p>
                    <p className="text-[11px] text-slate-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Shield className="w-10 h-10 text-blue-200 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-8">
            Join thousands of students who transformed their study habits with SmartStudy AI.
            Free forever. No setup fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={openRegister}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-base shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Create Your Free Account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={openLogin}
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">SmartStudy AI</span>
              <span className="text-xs text-slate-500 ml-2">Personal Study Timetable Generator</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SmartStudy AI · Built for academic excellence by{' '}
            <a href="https://github.com/tejch76" target="_blank" rel="noopener noreferrer"
               className="text-blue-400 hover:text-blue-300 font-medium">tejch76</a>
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <button onClick={openLogin}  className="hover:text-blue-400 transition-colors">Sign In</button>
            <button onClick={openRegister} className="hover:text-blue-400 transition-colors">Register</button>
            <a href="https://github.com/tejch76" target="_blank" rel="noopener noreferrer"
               className="hover:text-blue-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </div>
  )
}
