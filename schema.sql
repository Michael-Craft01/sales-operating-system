-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Status Enum
create type pipeline_stage as enum (
  'New', 'Qualified', 'Contacted', 'Engaged', 'Scheduled', 'ClosedWon', 'ClosedLost'
);

-- Leads Table
create table leads (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  address text,
  website text,
  phone text,
  email text,
  
  -- Context
  industry text,
  pain_point text,
  suggested_message text,
  
  -- Process
  stage pipeline_stage default 'New',
  status text default 'Active',
  last_action_at timestamptz default now(),
  created_at timestamptz default now(),
  
  -- Raw Data Backup
  raw_data jsonb
);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;

-- Policy: Allow service role (backend) full access, restricted for anon
create policy "Enable full access for service role" on leads
  for all
  using ( auth.role() = 'service_role' );
