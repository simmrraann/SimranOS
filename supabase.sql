-- Setup Script for SimranOS Supabase Backend

-- 1. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    category TEXT NOT NULL DEFAULT 'today',
    priority TEXT NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Create Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Zap',
    completed_today BOOLEAN NOT NULL DEFAULT false,
    streak INTEGER NOT NULL DEFAULT 0,
    last_completed_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Create Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'longterm',
    progress INTEGER NOT NULL DEFAULT 0,
    target INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Create Business Metrics Table
CREATE TABLE IF NOT EXISTS public.business_metrics (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'agency',
    name TEXT NOT NULL,
    value REAL NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT '',
    change REAL NOT NULL DEFAULT 0,
    period TEXT NOT NULL DEFAULT 'this month',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Note: In a real production app with authentication, 
-- you would want to add enable Row Level Security (RLS) here.
-- For a personal dashboard without auth, we allow public access.
