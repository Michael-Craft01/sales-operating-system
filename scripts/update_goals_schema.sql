-- Add new columns for robust goals
alter table goals 
add column if not exists amount numeric,
add column if not exists target_count integer,
add column if not exists scope text;
