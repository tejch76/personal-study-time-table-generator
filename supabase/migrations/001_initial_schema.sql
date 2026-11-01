-- ========================================================
-- SmartStudy AI - Database Schema Migration
-- PostgreSQL with Row-Level Security (RLS) enabled
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    college TEXT,
    degree TEXT,
    department TEXT,
    semester TEXT,
    target_cgpa NUMERIC(3, 2),
    daily_study_hours NUMERIC(3, 1) DEFAULT 4.0,
    preferred_start_time TEXT DEFAULT '09:00',
    preferred_end_time TEXT DEFAULT '22:00',
    sleep_start_time TEXT DEFAULT '23:00',
    sleep_end_time TEXT DEFAULT '07:00',
    session_duration INTEGER DEFAULT 50, -- in minutes
    break_duration INTEGER DEFAULT 10,   -- in minutes
    weekly_holidays TEXT[] DEFAULT ARRAY['Sunday'],
    timezone TEXT DEFAULT 'UTC',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    color TEXT DEFAULT '#4f46e5',
    difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3), -- 1: Easy, 2: Medium, 3: Hard
    priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),     -- 1: Low, 2: Medium, 3: High
    total_chapters INTEGER DEFAULT 10,
    completed_chapters INTEGER DEFAULT 0,
    weak_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    important_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    exam_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    chapter_number INTEGER NOT NULL DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    revision_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject_name TEXT NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TEXT DEFAULT '09:30',
    target_score TEXT,
    syllabus_completion INTEGER DEFAULT 0 CHECK (syllabus_completion BETWEEN 0 AND 100),
    preparation_status TEXT DEFAULT 'in_progress', -- 'not_started', 'in_progress', 'ready', 'completed'
    important_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    revision_checklist JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TIMETABLES TABLE
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Study Timetable',
    mode TEXT NOT NULL DEFAULT 'balanced' CHECK (mode IN ('balanced', 'exam', 'intensive')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id UUID REFERENCES public.timetables(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    topic TEXT,
    session_date DATE NOT NULL,
    start_time TEXT NOT NULL, -- e.g. '09:00'
    end_time TEXT NOT NULL,   -- e.g. '09:50'
    duration_minutes INTEGER NOT NULL,
    session_type TEXT DEFAULT 'study' CHECK (session_type IN ('study', 'revision', 'practice_test', 'break')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed', 'rescheduled')),
    rescheduled_from UUID REFERENCES public.study_sessions(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT DEFAULT 'assignment' CHECK (task_type IN ('assignment', 'project', 'revision', 'reading', 'other')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. POMODORO SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject_name TEXT,
    duration_minutes INTEGER NOT NULL,
    mode TEXT NOT NULL DEFAULT 'pomodoro_25', -- 'pomodoro_25', 'deep_50', 'custom'
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVISION RECORDS TABLE (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.revision_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    interval_days INTEGER NOT NULL CHECK (interval_days IN (1, 3, 7, 14, 30)),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    mastery_score INTEGER CHECK (mastery_score BETWEEN 1 AND 5),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('session_reminder', 'exam_alert', 'missed_session', 'revision', 'task', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR HIGH QUERY PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON public.chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_chapters_user_id ON public.chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON public.exams(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_date ON public.exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_timetables_user_id ON public.timetables(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON public.study_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_timetable ON public.study_sessions(timetable_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.study_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_user_id ON public.pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_user_id ON public.revision_records(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_date ON public.revision_records(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: users can only view/mutate their own data
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Macro helper for standard user_id based RLS
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'subjects', 'chapters', 'exams', 'timetables', 'study_sessions',
        'study_tasks', 'notes', 'pomodoro_sessions', 'revision_records', 'notifications'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%s_user_select" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "%s_user_select" ON public.%I FOR SELECT USING (auth.uid() = user_id)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "%s_user_insert" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "%s_user_insert" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "%s_user_update" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "%s_user_update" ON public.%I FOR UPDATE USING (auth.uid() = user_id)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "%s_user_delete" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "%s_user_delete" ON public.%I FOR DELETE USING (auth.uid() = user_id)', tbl, tbl);
    END LOOP;
END
$$;

-- Function to automatically handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'profiles', 'subjects', 'chapters', 'exams', 'timetables',
        'study_sessions', 'study_tasks', 'notes', 'revision_records'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_%s_updated_at ON public.%I', tbl, tbl);
        EXECUTE format('CREATE TRIGGER tr_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', tbl, tbl);
    END LOOP;
END
$$;
