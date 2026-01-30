'use client';

import { Ban } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TerminateLeadButton({ leadId }: { leadId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleTerminate() {
        if (!confirm('Are you sure you want to DELETE this lead permanently? This cannot be undone.')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadId);

            if (error) throw error;

            router.push('/'); // Redirect to dashboard
            router.refresh();
        } catch (e) {
            console.error('Error terminating lead:', e);
            alert('Failed to terminate lead.');
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleTerminate}
            disabled={loading}
            className="p-2 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 rounded-full transition-colors flex items-center justify-center gap-2 group"
            title="Terminate Lead"
        >
            <Ban className="w-5 h-5" />
        </button>
    );
}
