import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verify credentials exist to avoid runtime errors during build/dev if not set
if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials missing. Check .env.local");
}

const createMockBuilder = (errorMessage: string) => {
    const builder: any = {
        select: () => builder,
        order: () => builder,
        limit: () => builder,
        single: () => builder,
        insert: () => builder,
        eq: () => builder,
        range: () => builder,
        then: (resolve: any, reject: any) => {
             return Promise.resolve({ data: null, error: { message: errorMessage } }).then(resolve, reject);
        }
    };
    return builder;
};

// Create client or return a dummy to prevent crash
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : {
        from: () => createMockBuilder("Supabase not configured")
    } as any;
