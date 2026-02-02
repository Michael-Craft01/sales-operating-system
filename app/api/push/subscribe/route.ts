import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Save push subscription
export async function POST(request: NextRequest) {
    try {
        const subscription = await request.json();

        const { endpoint, keys } = subscription;

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return NextResponse.json(
                { error: 'Invalid subscription object' },
                { status: 400 }
            );
        }

        // Upsert subscription (update if endpoint exists, insert if not)
        const { error } = await supabase
            .from('push_subscriptions')
            .upsert({
                endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth,
            }, {
                onConflict: 'endpoint'
            });

        if (error) {
            console.error('Error saving subscription:', error);
            return NextResponse.json(
                { error: 'Failed to save subscription' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in subscribe:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Remove push subscription
export async function DELETE(request: NextRequest) {
    try {
        const { endpoint } = await request.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', endpoint);

        if (error) {
            console.error('Error removing subscription:', error);
            return NextResponse.json(
                { error: 'Failed to remove subscription' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in unsubscribe:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
