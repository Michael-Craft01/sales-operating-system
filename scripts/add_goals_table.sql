-- Goals Table
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('Monthly', 'Quarterly')),
  target_date date not null,
  description text not null,
  status text default 'Active' check (status in ('Active', 'Completed')),
  user_id uuid default auth.uid(), -- Optional if needed later
  created_at timestamptz default now()
);

-- Push Subscriptions Table
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table goals enable row level security;
alter table subscriptions enable row level security;

-- Policies (Open for now like leads, or strictly service role)
-- For development speed, we'll allow anon access similar to leads if needed, 
-- but ideally this should be authenticated. 
-- Assuming anon for now to match current project state.

create policy "Enable read access for all users" on goals for select using (true);
create policy "Enable insert for all users" on goals for insert with check (true);
create policy "Enable update for all users" on goals for update using (true);

create policy "Enable insert for all users" on subscriptions for insert with check (true);
create policy "Enable select for all users" on subscriptions for select using (true);
