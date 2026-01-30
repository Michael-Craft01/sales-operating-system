import { supabase } from "@/lib/supabase";
import { Deck } from "@/components/presentation/Deck";
import { X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function PresentationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

    if (!lead) return notFound();

    return (
        <div className="fixed inset-0 bg-black z-50 overflow-hidden text-white selection:bg-white selection:text-black">
            {/* Zen Navigation */}
            <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="text-sm font-bold tracking-widest uppercase opacity-30">Chocolate OS <span className="mx-2">/</span> Presentation Mode</div>
                <Link href={`/leads/${id}`} className="pointer-events-auto p-2 rounded-full hover:bg-white/10 transition-colors opacity-50 hover:opacity-100">
                    <X className="w-6 h-6" />
                </Link>
            </nav>

            {/* The Stage */}
            <main className="w-full h-full flex items-center justify-center">
                <Deck lead={lead} />
            </main>
        </div>
    );
}
