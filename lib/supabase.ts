import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verify credentials exist to avoid runtime errors during build/dev if not set
if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials missing. Check .env.local");
}

// Create client or return a dummy to prevent crash
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : {
        from: () => ({
            insert: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            select: () => Promise.resolve({ error: { message: "Supabase not configured" } })
        })
    } as any;
