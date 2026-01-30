import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export async function GET() {
    console.log('[TestDB] Starting connection test...');

    // 1. Check Env Vars (safely)
    const envCheck = {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    if (!envCheck.hasUrl || !envCheck.hasKey) {
        return NextResponse.json({
            status: 'error',
            message: 'Environment variables missing',
            env: envCheck,
            tip: 'Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
        }, { status: 500 });
    }

    try {
        // 2. Perform a real query
        // We use count because it's cheap and verifies read access
        const { count, error, data } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('[TestDB] Query error:', error);
            return NextResponse.json({
                status: 'error',
                message: 'Connection failed or Table not found',
                error: error,
                env: envCheck
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Connected to Supabase successfully!',
            data: {
                table: 'leads',
                recordCount: count,
                connection: 'active'
            },
            env: envCheck
        });

    } catch (e: any) {
        console.error('[TestDB] Unexpected error:', e);
        return NextResponse.json({
            status: 'error',
            message: 'Unexpected runtime error',
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
