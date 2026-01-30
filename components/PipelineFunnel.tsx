'use client';

import { motion } from 'framer-motion';

const STAGE_COLORS: Record<string, string> = {
    New: 'bg-zinc-600',
    Qualified: 'bg-zinc-500',
    Contacted: 'bg-zinc-400',
    Engaged: 'bg-zinc-300',
    Scheduled: 'bg-zinc-200',
    ClosedWon: 'bg-white',
    ClosedLost: 'bg-zinc-800',
};

const STAGE_LABELS: Record<string, string> = {
    New: 'New Leads',
    Qualified: 'Qualified',
    Contacted: 'Outreach',
    Engaged: 'Engaged',
    Scheduled: 'Meetings',
    ClosedWon: 'Deals Won',
    ClosedLost: 'Lost',
};

export function PipelineFunnel({ data }: { data: Record<string, number> }) {
    const maxVal = Math.max(...Object.values(data), 1);

    return (
        <div className="bg-black border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-6">Pipeline Velocity</h3>
            <div className="space-y-4">
                {Object.entries(STAGE_LABELS).map(([key, label], index) => {
                    if (key === 'ClosedLost') return null; // Hide lost from main funnel usually
                    const count = data[key] || 0;
                    const percent = (count / maxVal) * 100;

                    return (
                        <div key={key} className="group">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{label}</span>
                                <span className="text-sm font-mono text-zinc-600 group-hover:text-white transition-colors">{count}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-900">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.max(percent, 2)}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className={`h-full rounded-full ${STAGE_COLORS[key]} opacity-90 group-hover:opacity-100 transition-opacity`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
