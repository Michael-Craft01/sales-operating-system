-- RUN THIS IN SUPABASE DASHBOARD > SQL EDITOR
-- This policy allows the 'anon' (public) key to insert leads.
-- Required because the current environment uses the 'anon' key for backend operations.

-- 1. Drop existing policy if it conflicts (optional, safe to run)
drop policy if exists "Enable insert for anon" on leads;

-- 2. Create new policy allowing inserts for anyone with the anon key
create policy "Enable insert for anon"
on leads
for insert
to anon
with check (true);

-- 3. Ensure RLS is enabled (it usually is)
alter table leads enable row level security;
