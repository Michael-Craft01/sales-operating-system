"use client";

import { motion } from "framer-motion";
import { LeadCard } from "@/components/Board/LeadCard";
import { Lead, PipelineStage } from "@/types/lead";

interface LeadBoardProps {
    leads: Lead[];
}

const STAGES: PipelineStage[] = [
    'New',
    'Qualified',
    'Contacted',
    'Engaged',
    'Scheduled',
    'ClosedWon',
    'ClosedLost'
];

export function LeadBoard({ leads }: LeadBoardProps) {
    const handleAction = (action: string, leadId: string) => {
        console.log(`Action: ${action} on lead ${leadId}`);
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-6 h-full min-w-full snap-x">
            {STAGES.map((stage) => {
                const stageLeads = leads.filter(l => l.stage === stage);

                return (
                    <div key={stage} className="min-w-[400px] flex flex-col h-full snap-center">
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-6 px-4">
                            <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase opacity-70">
                                {stage.replace(/([A-Z])/g, ' $1').trim()}
                            </h2>
                            <span className="bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-mono">
                                {stageLeads.length}
                            </span>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 rounded-3xl p-2 space-y-4 overflow-y-auto no-scrollbar mask-gradient">
                            {stageLeads.map((lead) => (
                                <LeadCard key={lead.id} lead={lead} onAction={handleAction} />
                            ))}

                            {stageLeads.length === 0 && (
                                <div className="h-32 flex flex-col items-center justify-center text-zinc-700 text-xs gap-2 border border-dashed border-zinc-800 rounded-3xl mx-2">
                                    <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                                    <span>Empty Stage</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
