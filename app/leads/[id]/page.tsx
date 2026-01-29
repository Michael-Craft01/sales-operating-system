import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, Globe, Phone, Mail, Building, Edit2, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OutreachPanel } from "@/components/Workspace/OutreachPanel";
import { DocGenerator } from "@/components/Workspace/DocGenerator";

export const revalidate = 0; // Disable static caching for live data

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !lead) {
        notFound();
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/leads" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">{lead.business_name}</h1>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-300">
                                {lead.stage}
                            </span>
                            <span>Created {new Date(lead.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        AI Actions
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* LEFT COLUMN: Context & Info */}
                <div className="space-y-6 lg:col-span-1 overflow-y-auto no-scrollbar pb-10">

                    {/* Business Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-zinc-400 tracking-wider uppercase">Business Info</h2>
                            <button className="text-xs text-zinc-500 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                        </div>

                        <div className="space-y-3">
                            <InfoRow icon={MapPin} value={lead.address} label="Address" />
                            <InfoRow icon={Globe} value={lead.website} label="Website" isLink />
                            <InfoRow icon={Phone} value={lead.phone} label="Phone" />
                            <InfoRow icon={Mail} value={lead.email} label="Email" />
                            <InfoRow icon={Building} value={lead.industry} label="Industry" />
                        </div>
                    </div>

                    {/* Google Maps Embed (Manual Limitation: Requires API for real map, using Embed for now) */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden h-64 relative group">
                        {lead.address ? (
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(lead.address)}`}
                                className="opacity-50 group-hover:opacity-100 transition-opacity"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-600 text-xs">No address for map</div>
                        )}
                        {/* Fallback for no API Key */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/60 text-center p-4">
                            <p className="text-xs text-zinc-500">Map view requires API Key configuration.</p>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Outreach & Notes & Docs */}
                <div className="lg:col-span-2 flex flex-col space-y-6 h-full pb-1 overflow-y-auto no-scrollbar">

                    {/* AI Outreach Panel */}
                    <OutreachPanel lead={lead} />

                    {/* Document Generator */}
                    <DocGenerator leadContext={lead} />

                    {/* Internal Notes (Placeholder) */}
                    <div className="h-48 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shrink-0">
                        <h2 className="text-sm font-bold text-zinc-400 mb-2">Internal Notes</h2>
                        <textarea
                            className="w-full h-full bg-transparent text-zinc-300 text-sm placeholder-zinc-700 resize-none focus:outline-none"
                            placeholder="Type your notes here..."
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, value, label, isLink }: any) {
    if (!value) return null;

    return (
        <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group">
            <Icon className="w-4 h-4 text-zinc-500 mt-0.5 group-hover:text-zinc-300" />
            <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">{label}</p>
                {isLink ? (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-sm text-zinc-300 hover:text-white hover:underline truncate block">
                        {value}
                    </a>
                ) : (
                    <p className="text-sm text-zinc-300 truncate">{value}</p>
                )}
            </div>
        </div>
    )
}
