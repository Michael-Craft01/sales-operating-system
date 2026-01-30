import { supabase } from "@/lib/supabase";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StepNavigation } from "@/components/Workspace/StepNavigation";
import { TerminateLeadButton } from "@/components/TerminateLeadButton";

export default async function LeadLayout(props: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const { id } = params;

    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !lead) {
        return notFound();
    }

    return (
        <div className="h-full flex flex-col bg-[#050505]">
            {/* Persistant Header */}
            <header className="flex items-center justify-between p-4 border-b border-white/5 bg-black/50 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                    <Link href="/leads" className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-200" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">{lead.business_name}</h1>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-400">
                                {lead.stage}
                            </span>
                            <span>Created {new Date(lead.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/leads/${lead.id}/presentation`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-white text-black text-xs font-bold rounded-full transition-all"
                    >
                        <Sparkles className="w-3 h-3" />
                        Start Presentation
                    </Link>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-full border border-white/5 transition-all">
                        <Sparkles className="w-3 h-3 text-zinc-400" />
                        AI Actions
                    </button>
                    <div className="w-px h-6 bg-zinc-800 mx-1" />
                    <TerminateLeadButton leadId={lead.id} />
                </div>
            </header>

            {/* Step Navigation */}
            <StepNavigation leadId={lead.id} />

            {/* Content Area */}
            <main className="flex-1 overflow-hidden relative">
                {props.children}
            </main>
        </div>
    );
}
