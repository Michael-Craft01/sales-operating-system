'use client';

import { useEffect } from 'react';
import { checkStaleLeads } from '@/app/actions/engagement';
import { createNotification } from '@/app/actions/notifications';
import { toast } from 'sonner';

export function EngagementManager() {
    useEffect(() => {
        const runChecks = async () => {
            const today = new Date().toDateString();
            const lastSeen = localStorage.getItem('crm_last_seen_date');

            // 1. Morning Briefing (Once per day)
            if (lastSeen !== today) {
                localStorage.setItem('crm_last_seen_date', today);

                await createNotification({
                    type: 'info',
                    title: 'Morning Briefing',
                    message: 'Welcome back. Let\'s crush the targets today.',
                    link: '#'
                });

                toast("Good Morning", { description: "System ready. Engagement protocols active." });
            }

            // 2. Ghost Protocol (Stale Leads)
            // We check this every time dashboard loads, but we should verify if we recently notified to avoid spam.
            // For simplicity in this version, we'll just check.
            const staleLeads = await checkStaleLeads();

            if (staleLeads.length > 0) {
                // Determine if we already notified about this today?
                // Let's just notify about the first one if we haven't checked recently.
                const lastGhostCheck = localStorage.getItem('crm_ghost_check');
                const now = Date.now();

                // Only check ghosts once per hour to avoid spam
                if (!lastGhostCheck || now - parseInt(lastGhostCheck) > 1000 * 60 * 60) {
                    localStorage.setItem('crm_ghost_check', now.toString());

                    const lead = staleLeads[0];
                    await createNotification({
                        type: 'warning',
                        title: 'Ghost Alert',
                        message: `${lead.business_name} hasn't been touched in 7 days. They are slipping away.`,
                        link: `/leads/${lead.id}/onboarding`
                    });
                }
            }
        };

        runChecks();
    }, []);

    return null; // Invisible component
}
