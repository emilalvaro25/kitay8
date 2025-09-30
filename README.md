# kitay8
>>>>>>> a7ef1837651567ab4e9f871cf929d3bd33323286
-- Enable the pgvector extension in your Supabase SQL editor
create extension vector with schema extensions;

-- user_settings table
create table user_settings (
  id uuid primary key references auth.users (id) on delete cascade,
  "personaName" text,
  "systemPrompt" text,
  voice text,
  template boolean,
  tools jsonb,
  tokens integer default 1000
);

-- user_memory table
create table user_memory (
  id uuid primary key references auth.users (id) on delete cascade,
  personality text,
  "keyPeople" text,
  "myBusiness" text,
  "commsStyle" text,
  "personalPrefs" text,
  "negativePrompt" text
);

-- user_conversations table
create table user_conversations (
  id uuid primary key references auth.users (id) on delete cascade,
  turns jsonb
);

-- conversation_embeddings table
-- This table stores vectorized content from conversations for semantic search.
create table conversation_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  turn_content text not null,
  embedding vector(384), -- Corresponds to all-MiniLM-L6-v2 model
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- user_apps table
create table user_apps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  name text not null,
  description text,
  logo_url text not null,
  app_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- user_calendar_events table
create table user_calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  summary text not null,
  "startTime" timestamptz not null,
  "endTime" timestamptz not null,
  location text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Deploying Supabase Edge Functions
-- 1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
-- 2. Link your project: `supabase link --project-ref <YOUR-PROJECT-REF>`
-- 3. Deploy the function: `supabase functions deploy semantic-search`
=======
# kitay8
>>>>>>> a7ef1837651567ab4e9f871cf929d3bd33323286
