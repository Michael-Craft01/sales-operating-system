import { DocGenerator } from "@/components/Workspace/DocGenerator";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function PresentationPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { data: lead } = await supabase.from('leads').select('*').eq('id', params.id).single();
    if (!lead) return notFound();

    return (
        <div className="w-full space-y-8 p-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">04. Presentation Delivery</h2>
                <p className="text-zinc-400 max-w-2xl">
                    Generate and send custom proposals, audit reports, or onboarding plans using AI.
                </p>
            </div>

            <div className="w-full">
                <DocGenerator leadContext={lead} />
            </div>
        </div>
    );
}
