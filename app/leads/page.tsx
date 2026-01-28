"use client";

"use client";

import { useEffect, useState } from "react";
import { LeadBoard } from "@/components/Board/LeadBoard";
import { Lead, PipelineStage } from "@/types/lead";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            const json = await res.json();

            if (json.leads) {
                const mappedLeads: Lead[] = json.leads.map((l: any) => ({
                    id: l.id,
                    businessName: l.business_name,
                    stage: l.stage as PipelineStage,
                    status: l.status,
                    address: l.address,
                    category: l.industry,
                    suggestedMessage: l.suggested_message,
                    email: l.email,
                    phone: l.phone,
                    website: l.website,
                    createdAt: new Date(l.created_at),
                    lastActionAt: new Date(l.last_action_at || l.created_at)
                }));
                setLeads(mappedLeads);
            }
        } catch (err) {
            console.error("Failed to fetch leads", err);
        }
        setLoading(false);
    };

    const handleSeed = async () => {
        setLoading(true);
        await fetch('/api/seed', { method: 'POST' });
        await fetchLeads();
    };

    const handleMoveLead = async (leadId: string, newStage: PipelineStage) => {
        // Optimistic update handled in board
        // In a real app, we'd fire a PATCH request to /api/leads here
        console.log("Saving move:", leadId, newStage);
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <header className="mb-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Lead Operations</h1>
                    <p className="text-zinc-500">Manage your active pipeline.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSeed}
                        className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full font-bold hover:bg-zinc-700 transition-colors text-sm"
                    >
                        + Demo Data
                    </button>
                    <button
                        onClick={() => fetchLeads()}
                        className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 animate-pulse">
                    Syncing leads...
                </div>
            ) : (
                <div className="flex-1 min-h-0 overflow-hidden">
                    <LeadBoard initialLeads={leads} onLeadMove={handleMoveLead} />
                </div>
            )}
        </div>
    );
}
