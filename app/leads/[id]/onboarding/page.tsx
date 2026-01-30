import { BusinessCard } from "@/components/Workspace/BusinessCard";
import { LeadAnalyzer } from "@/components/Workspace/LeadAnalyzer";
import { OnboardingDocGenerator } from "@/components/Workspace/OnboardingDocGenerator";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function OnboardingPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params; // Next.js 15 Requirement

    // We fetch again because layout params aren't passed down automatically unless we prefer context, 
    // but separate fetching is safer for Next.js caching.
    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!lead) return notFound();

    return (
        <div className="w-full space-y-8 p-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">01. Onboarding & Research</h2>
                <p className="text-zinc-400 max-w-2xl">
                    Verify the lead's information and perform initial strategic analysis.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Business Info */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Business Intel</h3>
                    <BusinessCard lead={lead} />
                </div>

                {/* Right Column: Strategic Analysis (Replaces Map) */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Strategic Analysis</h3>
                    <LeadAnalyzer lead={lead} />
                </div>
            </div>

            {/* Onboarding Document */}
            <div className="space-y-4 pt-8 border-t border-white/5 mt-12">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Onboarding & Strategy Document</h3>
                    <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded text-zinc-500 font-mono">STEP 1.2: GENERATE ASSETS</span>
                </div>
                <OnboardingDocGenerator leadContext={lead} />
            </div>

            {/* Notes Area */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Research Notes</h3>
                <div className="h-48 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <textarea
                        className="w-full h-full bg-transparent text-zinc-300 text-sm placeholder-zinc-700 resize-none focus:outline-none"
                        placeholder="Type any observations here..."
                    />
                </div>
            </div>
        </div>
    );
}
