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
  using ( auth.role() = 'service_role' );

-- PERFORMANCE OPTIMIZATION (Robustness)
-- Indexes for frequent query patterns
create index leads_stage_idx on leads (stage);
create index leads_created_at_idx on leads (created_at desc);
create index leads_business_name_idx on leads using gin (to_tsvector('english', business_name));

-- HISTORY / AUDIT LOG (Robustness)
create table status_history (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade not null,
  action_type text not null, -- 'Call', 'Email', 'StageChange', 'Note'
  old_value text,
  new_value text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Index for history lookups
create index history_lead_id_idx on status_history (lead_id);

