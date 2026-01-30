alter table leads add column if not exists presentation_data jsonb;

-- Optional: Add index if we query by this content later (not needed now)
