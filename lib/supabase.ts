import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verify credentials exist to avoid runtime errors during build/dev if not set
if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials missing. Check .env.local");
}

class MockQueryBuilder {
    errorMessage: string;

    constructor(errorMessage: string) {
        this.errorMessage = errorMessage;
    }

    select(columns?: string, options?: any) {
        return this;
    }

    order(column: string, options?: any) {
        return this;
    }

    limit(count: number) {
        return this;
    }

    single() {
        return this;
    }

    insert(row: any) {
        return this;
    }

    eq(column: string, value: any) {
        return this;
    }

    range(from: number, to: number) {
        return this;
    }

    // Thenable interface implementation
    then(resolve: (value: any) => void, reject: (reason?: any) => void) {
        // Return a shape that mimics Supabase response
        const mockResponse = {
            data: [],
            count: 0,
            error: { message: this.errorMessage }
        };
        return Promise.resolve(mockResponse).then(resolve, reject);
    }
}

// Create client or return a dummy to prevent crash
const isConfigured = !!supabaseUrl && !!supabaseKey;

if (!isConfigured) {
    // Only log once to avoid spamming
    if (typeof window === 'undefined') {
        console.warn("⚠️ Supabase credentials missing. Check .env.local");
    }
}

export const supabase = isConfigured
    ? createClient(supabaseUrl!, supabaseKey!)
    : {
        from: (table: string) => new MockQueryBuilder("Supabase not configured")
    } as any;
