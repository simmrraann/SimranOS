-- Drop old tables to migrate to the new SimranOS structure safely
DROP TABLE IF EXISTS "public"."tasks" CASCADE;
DROP TABLE IF EXISTS "public"."habits" CASCADE;
DROP TABLE IF EXISTS "public"."goals" CASCADE;
DROP TABLE IF EXISTS "public"."business_metrics" CASCADE;
DROP TABLE IF EXISTS "public"."agency_pipeline" CASCADE;
DROP TABLE IF EXISTS "public"."content_series" CASCADE;
DROP TABLE IF EXISTS "public"."curriculum_outputs" CASCADE;

-- 1. Tasks
CREATE TABLE public.tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'uncategorized', -- aijugaad, content, curriculum, brand
    block TEXT, -- block1, block2, block3
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Tasks
INSERT INTO public.tasks (title, category, block) VALUES 
('Build AIJugaad website', 'aijugaad', 'block1'),
('DM 10 small business owners', 'aijugaad', 'block1'),
('Script: Big Day by Iman Ghazi (Marketing Re-Coded)', 'content', 'block3'),
('Script: Tam Kor "Buy Me Flowers" (Marketing Re-Coded)', 'content', 'block3'),
('Post reel on main Instagram page', 'brand', 'block2'),
('Add Notion links to personal curriculum tracker', 'curriculum', 'block2'),
('Record podcast episode (random thoughts, cozy format)', 'content', 'block3');

-- 2. Habits
CREATE TABLE public.habits (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'non_negotiable' or 'scheduled'
    time_label TEXT, -- e.g. '5:00am' or '7:30-10:30am'
    icon TEXT,
    completed_today BOOLEAN DEFAULT false,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Habits
INSERT INTO public.habits (name, type, time_label, icon) VALUES 
-- Non-negotiables
('Morning journal (write thoughts/intentions/mistakes)', 'non_negotiable', NULL, 'book'),
('Physical book reading (2 hours total)', 'non_negotiable', NULL, 'library'),
('Substack reading (min 3 docs) & write learnings', 'non_negotiable', NULL, 'newspaper'),
('YouTube learning (2-3 AI videos)', 'non_negotiable', NULL, 'youtube'),
('Naamjap walk (Krishna naamjap)', 'non_negotiable', NULL, 'footprints'),
('Night reading (Substack + Fictional)', 'non_negotiable', NULL, 'moon'),

-- Scheduled
('Wake up, stare out window 10 min', 'scheduled', '5:00am', 'sun'),
('Morning journal', 'scheduled', '6:00am', 'book'),
('Substack reading', 'scheduled', '6:20am', 'newspaper'),
('AI news brief (ask Claude)', 'scheduled', '6:50am', 'bot'),
('Get fresh, make coffee (sacred ritual)', 'scheduled', '7:00am', 'coffee'),
('Deep work block 1 (AIJugaad, hardest task)', 'scheduled', '7:30–10:30am', 'hammer'),
('Recovery (Breakfast + Radhakrishna + scroll)', 'scheduled', '10:30–12:30pm', 'battery-charging'),
('Physical book reading', 'scheduled', '12:30–2:00pm', 'book-open'),
('Deep work block 2 (Medium implementation task)', 'scheduled', '2:00–3:00pm', 'zap'),
('Lunch + Radhakrishna', 'scheduled', '3:00–3:30pm', 'utensils'),
('Naamjap walk', 'scheduled', '3:30–4:00pm', 'footprints'),
('Nap (no guilt)', 'scheduled', '4:00–4:40pm', 'bed'),
('Content shooting OR YouTube learning', 'scheduled', '5:00–6:30pm', 'camera'),
('Deep work block 3 (content/agency/scripts)', 'scheduled', '8:00–9:30pm', 'keyboard'),
('Dinner + wind down', 'scheduled', '9:30–10:15pm', 'moon'),
('Night reading', 'scheduled', '10:15–11:30pm', 'book'),
('Sleep', 'scheduled', '12:00am', 'bed');


-- 3. Goals
CREATE TABLE public.goals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- money, social, agency, travel
    target NUMERIC DEFAULT 0,
    progress NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, achieved
    is_milestone BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Goals (Money)
INSERT INTO public.goals (title, category, target, progress, status, is_milestone) VALUES 
('₹10k', 'money', 10000, 10000, 'achieved', true),
('₹20k', 'money', 20000, 20000, 'achieved', true),
('₹30k', 'money', 30000, 30000, 'achieved', true),
('₹40k', 'money', 40000, 0, 'pending', true),
('₹50k (BIGGEST MILESTONE)', 'money', 50000, 0, 'pending', true),
('₹60k', 'money', 60000, 0, 'pending', true),
('₹70k', 'money', 70000, 0, 'pending', true),
('₹80k', 'money', 80000, 0, 'pending', true),
('₹90k', 'money', 90000, 0, 'pending', true),
('₹1 Lakh (HALF GOAL)', 'money', 100000, 0, 'pending', true),
('₹1.1L', 'money', 110000, 0, 'pending', true),
('₹1.2L', 'money', 120000, 0, 'pending', true),
('₹1.3L', 'money', 130000, 0, 'pending', true),
('₹1.4L', 'money', 140000, 0, 'pending', true),
('₹1.5L', 'money', 150000, 0, 'pending', true),
('₹1.6L', 'money', 160000, 0, 'pending', true),
('₹1.7L', 'money', 170000, 0, 'pending', true),
('₹1.8L', 'money', 180000, 0, 'pending', true),
('₹1.9L', 'money', 190000, 0, 'pending', true),
('₹2 Lakh (FINAL GOAL)', 'money', 200000, 0, 'pending', true),
('Bank Balance (June target)', 'money', 250000, 0, 'pending', false);

-- Seed Goals (Social)
INSERT INTO public.goals (title, category, target, progress, status) VALUES 
('Instagram Followers', 'social', 50000, 12500, 'pending'),
('YouTube Subscribers', 'social', 10000, 0, 'pending'),
('Kollab app beta users', 'social', 500, 50, 'pending');

-- Seed Goals (Agency & Travel)
INSERT INTO public.goals (title, category, target, progress, status) VALUES 
('AIJugaad Revenue', 'agency', 100000, 0, 'pending'),
('Vrindavan', 'travel', 50000, 0, 'pending'),
('Ladakh', 'travel', 100000, 0, 'pending'),
('Dubai', 'travel', 150000, 0, 'pending');


-- 4. Agency Pipeline (Kanban)
CREATE TABLE public.agency_pipeline (
    id SERIAL PRIMARY KEY,
    client_name TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'not_contacted', -- not_contacted, dmed, replied, call_booked, paid
    value NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- 5. Content Series
CREATE TABLE public.content_series (
    id SERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- done, scripting, pending
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Content
INSERT INTO public.content_series (platform, title, status) VALUES
('instagram', 'Ep 1: Rhode Beauty (Hailey Bieber)', 'done'),
('instagram', 'Ep 2: Stanley Cup', 'done'),
('instagram', 'Ep 3: Starbucks', 'done'),
('instagram', 'Ep 4: Big Day by Iman Ghazi', 'scripting'),
('instagram', 'Ep 5: Tam Kor "Buy Me Flowers"', 'scripting');


-- 6. Curriculum Outputs
CREATE TABLE public.curriculum_outputs (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE DEFAULT CURRENT_DATE,
    substack_diary BOOLEAN DEFAULT false,
    main_diary BOOLEAN DEFAULT false,
    linkedin_post BOOLEAN DEFAULT false,
    morning_journal BOOLEAN DEFAULT false,
    insta_video BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
