# SmartStudy AI – Personal Study Timetable Generator

> **"Plan Smarter. Study Better. Achieve More."**  
> An intelligent, autonomous, full-stack personal study timetable generator and student productivity platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![GitHub](https://img.shields.io/badge/GitHub-tejch76-indigo?logo=github)](https://github.com/tejch76)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

SmartStudy AI transforms complex academic syllabi, upcoming examination deadlines, and student focus routines into an achievable, balanced daily study schedule. 

Unlike simple static calendars, SmartStudy AI utilizes a **deterministic multi-factor constraint satisfaction scheduling engine** combined with **Google Gemini AI** strategic guidance, spaced repetition (Ebbinghaus forgetting curve intervals), and conflict-free automatic rescheduling.

---

## 🚀 Key Features

### 1. Intelligent Timetable Generator
- **Three Generation Modes**:
  - **Balanced Mode**: Proportional distribution across all courses based on difficulty, credit priority, and syllabus completion.
  - **Exam Mode**: Strategically funnels 65%+ study volume to imminent examinations (<14 days), inserting mock tests and formula revisions.
  - **Intensive Mode**: High-density study blocks with compact rest intervals for urgent syllabus completion.
- **Sleep & Routine Guard**: Strictly safeguards student sleep windows (e.g. 23:00 - 07:00) and personal meal/rest hours.
- **Multiple Views**: Daily Agenda, Weekly Timetable Grid, and Monthly Curriculum Map.

### 2. Smart Conflict-Free Auto-Rescheduling
- Detects missed or overdue study blocks.
- 1-click automatic relocation algorithm searches upcoming days for the earliest free slot.
- Never schedules past examination deadlines or causes overlaps.

### 3. Integrated Pomodoro Study Timer
- Pre-configured intervals: 25-minute standard, 50-minute deep focus, 5-minute short break, 10-minute long break, or custom durations.
- Synthesized Web Audio chimes (no external audio assets required) and Web Browser notifications.
- Automatically records completed sessions to Supabase / persistent database.

### 4. Spaced Revision Tracker
- Scientific intervals: **1, 3, 7, 14, and 30 days** based on the Ebbinghaus Forgetting Curve.
- 1 to 5 star topic mastery tracking.

### 5. Examination Countdown & Readiness
- Countdown cards ("Exam in 12 days") with automatic proximity sorting.
- Syllabus completion sliders and interactive revision checklists.

### 6. Interactive Analytics & Performance
- Built with **Recharts**:
  - Daily & weekly study hours area chart vs daily target.
  - Subject workload distribution donut chart.
  - Completed vs scheduled vs relocated session breakdown.
  - Calculated consistency score (0-100) and daily study streak counter.

### 7. Export Engine
- Download styled 7-Day Weekly Timetable as PDF (using **jsPDF**).
- Download Today's Agenda as PDF.
- Export as CSV spreadsheet for Excel / Google Sheets.
- Print-optimized CSS styling.

### 8. Full Supabase Database & Auth (with Zero-Friction Demo Mode)
- 11 relational PostgreSQL tables with UUID primary keys, foreign key constraints, updated_at triggers, and Row Level Security (RLS) policies.
- Seamless fallback to local storage adapter when offline or before Supabase credentials are plugged in.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS, PostCSS, Custom Scrollbars |
| **Icons & UI** | Lucide React, Canvas Confetti |
| **Data Visualizations** | Recharts (Area, Donut, Bar charts) |
| **Backend & DB** | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| **AI Integration** | Google Gemini 1.5 Flash via Vercel Serverless Function (`/api/gemini.ts`) |
| **Export Engines** | jsPDF, CSV, Print CSS |
| **Deployment** | Vercel (Configured with `vercel.json`) |

---

## 📁 Project Architecture

```
personal-study-timetable-generator/
├── api/
│   └── gemini.ts                     # Secure Vercel Serverless Function for Gemini AI
├── public/
│   └── logo.svg                      # SmartStudy AI brand icon
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx     # Recharts performance & distribution dashboard
│   │   ├── auth/
│   │   │   └── AuthModal.tsx         # Sign in, Sign up, Password recovery, Demo fast-track
│   │   ├── dashboard/
│   │   │   └── StudentDashboard.tsx  # Central student command center
│   │   ├── exams/
│   │   │   └── ExamCountdown.tsx     # Countdown badges, readiness tracker & checklist
│   │   ├── export/
│   │   │   └── ExportModal.tsx       # jsPDF & CSV export engine
│   │   ├── landing/
│   │   │   └── LandingPage.tsx       # Modern SaaS marketing page with live preview
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Layout wrapper
│   │   │   ├── Navbar.tsx            # Sticky topbar with streak counter & notification bell
│   │   │   └── Sidebar.tsx           # Responsive sidebar with badge indicators
│   │   ├── notes/
│   │   │   └── NotesAndTasks.tsx     # Rich notes tagged by subject & assignment tracker
│   │   ├── onboarding/
│   │   │   └── OnboardingWizard.tsx  # 3-step student routine & curriculum setup wizard
│   │   ├── pomodoro/
│   │   │   └── PomodoroTimer.tsx     # Interactive timer with chimes & Supabase focus logs
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx      # Profile, study constraints, dark/light theme, notifications
│   │   ├── subjects/
│   │   │   └── SubjectManagement.tsx # Full CRUD, colors, difficulty & chapter progress
│   │   ├── syllabus/
│   │   │   └── SyllabusTracker.tsx   # Spaced repetition intervals (1, 3, 7, 14 days)
│   │   └── timetable/
│   │       └── TimetablePage.tsx     # Daily, Weekly, Monthly views, AI advice card, manual adds
│   ├── context/
│   │   ├── AppContext.tsx            # Global application state & scheduling triggers
│   │   └── AuthContext.tsx           # Supabase Auth & persistent session provider
│   ├── lib/
│   │   ├── notifications.ts          # Web Notifications API & Web Audio chime generator
│   │   ├── storage.ts                # Persistent storage adapter & realistic academic demo data
│   │   ├── supabase.ts               # Supabase client initializer & config validation
│   │   └── scheduler/
│   │       ├── algorithm.ts          # Deterministic multi-factor scheduling engine
│   │       └── rescheduler.ts        # Conflict-free auto-rescheduling algorithm
│   ├── types/
│   │   └── index.ts                  # Comprehensive TypeScript interfaces
│   ├── App.tsx                       # Main router between landing, onboarding & dashboard
│   ├── index.css                     # Tailwind directives & print styling
│   └── main.tsx                      # React root
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # 11 PostgreSQL tables, indexes & RLS policies
├── .env.example                      # Environment variables template
├── index.html                        # HTML entrypoint
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                       # Vercel deployment & routing config
└── vite.config.ts
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/tejch76/smartstudy-ai.git
cd smartstudy-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your credentials:
```env
# Supabase (From Supabase Dashboard -> Project Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Google Gemini API Key (Serverless functions only)
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you run without `.env`, SmartStudy AI automatically activates its internal local storage demo mode so you can test all features immediately!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase)

1. Open your [Supabase Dashboard](https://supabase.com).
2. Create a new project.
3. Navigate to the **SQL Editor** in the left sidebar.
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql` and run it.
5. This creates:
   - `profiles`, `subjects`, `chapters`, `exams`, `timetables`, `study_sessions`, `study_tasks`, `notes`, `pomodoro_sessions`, `revision_records`, and `notifications`.
   - Enables Row Level Security (RLS) on all user-owned tables.
   - Configures automatic `updated_at` trigger functions.

---

## 🌐 Deploy to Vercel

SmartStudy AI is pre-configured for seamless deployment to Vercel:

1. Push your code to GitHub under `https://github.com/tejch76/smartstudy-ai`.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `smartstudy-ai` repository.
4. Set the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
6. Click **Deploy**. Vercel will build the frontend and serve `/api/gemini` as a serverless endpoint!

---

## 📄 License
This project is licensed under the MIT License.
