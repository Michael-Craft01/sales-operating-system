-- Add value column to leads for pipeline amount
alter table leads 
add column if not exists value numeric default 0;

-- Create index for sorting by value
create index if not exists leads_value_idx on leads (value desc);
