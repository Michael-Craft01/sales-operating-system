-- Add persistence for AI Presentation Data
alter table leads 
add column if not exists presentation_data jsonb;

-- Optional: Add index if we plan to query inside the JSON often (unlikely for now)
-- create index leads_presentation_data_idx on leads using gin (presentation_data);
