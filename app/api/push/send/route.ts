import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configure web-push with VAPID credentials
webpush.setVapidDetails(
    'mailto:admin@choc-sales.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

interface PushPayload {
    title: string;
    body: string;
    url?: string;
    icon?: string;
}

// POST: Send push notification to all subscribers
export async function POST(request: NextRequest) {
    try {
        const payload: PushPayload = await request.json();

        if (!payload.title || !payload.body) {
            return NextResponse.json(
                { error: 'Title and body are required' },
                { status: 400 }
            );
        }

        // Get all subscriptions from database
        const { data: subscriptions, error: fetchError } = await supabase
            .from('push_subscriptions')
            .select('*');

        if (fetchError) {
            console.error('Error fetching subscriptions:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch subscriptions' },
                { status: 500 }
            );
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                sent: 0,
                message: 'No subscribers found'
            });
        }

        // Send notification to each subscriber
        const results = await Promise.allSettled(
            subscriptions.map(async (sub) => {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    },
                };

                try {
                    await webpush.sendNotification(
                        pushSubscription,
                        JSON.stringify({
                            title: payload.title,
                            body: payload.body,
                            url: payload.url || '/',
                            icon: payload.icon || '/favicon.png',
                        })
                    );
                    return { success: true, endpoint: sub.endpoint };
                } catch (error: unknown) {
                    // If subscription is invalid (410 Gone), remove it
                    const pushError = error as { statusCode?: number };
                    if (pushError.statusCode === 410) {
                        await supabase
                            .from('push_subscriptions')
                            .delete()
                            .eq('endpoint', sub.endpoint);
                    }
                    throw error;
                }
            })
        );

        const successful = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        return NextResponse.json({
            success: true,
            sent: successful,
            failed,
            total: subscriptions.length,
        });
    } catch (error) {
        console.error('Error sending push:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
