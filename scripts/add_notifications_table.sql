-- Create notifications table
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('info', 'success', 'warning', 'error')),
  title text not null,
  message text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table notifications enable row level security;

-- Policy: Service role has full access (simplification for single-user app)
create policy "Allow all access to service role"
  on notifications
  for all
  using ( auth.role() = 'service_role' )
  with check ( auth.role() = 'service_role' );
  
-- Allow public read/write for now since auth is loose in this dev mode
create policy "Allow public access for dev"
  on notifications
  for all
  using ( true )
  with check ( true );

-- Index for sorting
create index notifications_created_at_idx on notifications (created_at desc);
