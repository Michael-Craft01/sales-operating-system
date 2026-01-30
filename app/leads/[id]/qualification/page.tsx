import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { QualificationQuestions } from "@/components/Workspace/QualificationQuestions";
import { OutreachPanel } from "@/components/Workspace/OutreachPanel";
import { BANTForm } from "@/components/Workspace/BANTForm";
import { SalesDocGenerator } from "@/components/Workspace/SalesDocGenerator";
import { FileCheck, Calendar } from "lucide-react";

export default async function QualificationPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!lead) return notFound();

    return (
        <div className="w-full space-y-8 p-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">02. Lead Qualification</h2>
                <p className="text-zinc-400 max-w-2xl">
                    Assess lead fit using the 15-point strategic questionnaire and BANT criteria.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: 15 Questions */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">15 Strategic Questions</h3>
                    <QualificationQuestions lead={lead} />
                </div>

                {/* Right Column: Outreach & BANT */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Outreach & Notes</h3>
                    <OutreachPanel lead={lead} />

                    <div className="pt-6 border-t border-white/5 space-y-6">
                        <BANTForm lead={lead} />

                        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/5">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Proposal & Agreements</h3>
                            <SalesDocGenerator
                                leadContext={lead}
                                docType="contract"
                                title="Service Contract"
                            />
                            <SalesDocGenerator
                                leadContext={lead}
                                docType="meeting_plan"
                                title="Meeting Schedule"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
