import React, { useState } from 'react'
import {
  Sparkles,
  CalendarDays,
  Brain,
  Timer,
  Repeat,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Moon,
  Sun,
  Laptop
} from 'lucide-react'
import { AuthModal } from '../auth/AuthModal'
import { useApp } from '../../context/AppContext'

export const LandingPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useApp()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')

  const openRegister = () => {
    setAuthMode('register')
    setAuthModalOpen(true)
  }

  const openLogin = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                SmartStudy AI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={openLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={openRegister}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden text-center px-6">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-sky-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Cognitive Scheduler • Powered by Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Plan Smarter. Study Better. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Achieve More.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your personal AI-powered study companion that transforms your goals into an achievable daily study plan with spaced repetition, exam countdowns, and automatic rescheduling.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openRegister}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#features"
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-soft transition-all"
            >
              Explore Features
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Deterministic Scheduling Logic</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full Supabase Database & Auth</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Spaced Repetition Intervals</span>
            </span>
          </div>
        </div>

        {/* Attractive Dashboard Preview Mockup */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-indigo-500/20 via-slate-200/40 dark:via-slate-800/40 to-transparent border border-indigo-200/60 dark:border-slate-700/60 shadow-2xl">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-8 text-left">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">smartstudy-ai.vercel.app/dashboard</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                ● Live System
              </span>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <span className="text-[10px] font-bold uppercase text-indigo-500">Today's Target</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">3.5h / 4.5h</h4>
                <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-indigo-600 rounded-full" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold uppercase text-emerald-500">Upcoming Exam</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">12 Days Left</h4>
                <p className="text-[11px] text-slate-500">Data Structures & Algorithms</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <span className="text-[10px] font-bold uppercase text-amber-500">Auto-Rescheduler</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">0 Overlaps</h4>
                <p className="text-[11px] text-slate-500">Conflict-free relocation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Showcase Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-200/80 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Intelligent Features
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for Academic Mastery
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every feature is backed by cognitive science principles to optimize retention and time efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI & Deterministic Scheduler
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mathematical constraint satisfaction balancing subject difficulty, syllabus deficit, upcoming exams, and student sleep windows with Gemini insights.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Repeat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Spaced Revision Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatic spaced repetition triggers at 1, 3, 7, and 14-day intervals to conquer the Ebbinghaus forgetting curve.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Smart Auto-Rescheduling
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Missed a study task? SmartStudy relocates it to the next available free slot before your exam deadline without creating overlaps.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pomodoro Focus Timer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              25m and 50m deep focus timers with synthesized audio chimes, browser notifications, and automatic focus logging.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Analytics & Productivity Metrics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive Recharts visualizations for weekly study hours, subject allocation donut charts, and consistency scoring.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Export to PDF & CSV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate formatted PDF timetables and CSV spreadsheet exports with 1 click for physical printouts or calendar imports.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How SmartStudy AI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enter Academic Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input your subjects, chapters, weak topics, upcoming exam dates, and daily study availability.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Intelligent Synthesis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Our constraint satisfaction algorithm slices subjects into optimal focus blocks, spacing revisions and breaks automatically.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Execute & Adapt
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Study with the integrated Pomodoro timer. Missed a session? 1-click auto-rescheduling keeps you on track without stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sample Student Testimonials */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-200/80 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Student Success Stories
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved by High-Achieving Students
          </h2>
          <p className="text-xs text-slate-400">
            *Sample representative student testimonials from beta evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "The automatic rescheduling feature alone saved my semester. When an unexpected lab report came up, SmartStudy relocated my DSA revision without ruining my exam readiness."
            </p>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-400">Computer Science, Stanford</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "The spaced repetition intervals locked operating system algorithms into my permanent memory. I improved my GPA from 3.2 to 3.85 in one academic quarter."
            </p>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Marcus Chen</p>
              <p className="text-[10px] text-slate-400">Electrical & Computer Engineering</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "Having the Pomodoro timer tied directly into today's timetable sessions kept me accountable. Plus, exporting the weekly schedule as PDF makes sticking to it painless."
            </p>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Priya Patel</p>
              <p className="text-[10px] text-slate-400">Biomedical Engineering</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer id="about" className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              SmartStudy AI
            </span>
            <span>• Personal Study Timetable Generator</span>
          </div>

          <p>© {new Date().getFullYear()} SmartStudy AI. Built for academic excellence.</p>

          <div className="flex items-center gap-6">
            <button onClick={openLogin} className="hover:text-indigo-600">Sign In</button>
            <button onClick={openRegister} className="hover:text-indigo-600">Register</button>
            <a href="https://github.com/tejch76" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">GitHub (tejch76)</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}
