"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ExternalLink, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { Lead } from "@/types/lead";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface LeadCardProps {
    lead: Lead;
    onAction: (action: string, leadId: string) => void;
}

export function LeadCard({ lead, onAction }: LeadCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
            {/* Top Row: Business Name & Badges */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors truncate max-w-[200px] tracking-tight" title={lead.businessName}>
                        {lead.businessName}
                    </h3>
                    <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-medium">
                        {lead.category || "Uncategorized"}
                    </p>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    lead.stage === 'New' ? "bg-white text-black border-white" :
                        lead.stage === 'Qualified' ? "bg-zinc-800 text-white border-zinc-700" :
                            "bg-transparent text-zinc-500 border-zinc-800"
                )}>
                    {lead.stage}
                </div>
            </div>

            {/* Message Preview (if any) */}
            {lead.suggestedMessage && (
                <div className="mb-5 bg-black/20 p-4 rounded-2xl border border-white/5 relative overflow-hidden group/msg">
                    <div className="absolute top-0 left-0 w-1 h-full bg-white/20 group-hover/msg:bg-white transition-colors" />
                    <p className="text-xs text-zinc-400 line-clamp-2 italic font-serif leading-relaxed pl-2">
                        &quot;{lead.suggestedMessage}&quot;
                    </p>
                </div>
            )}

            {/* Info Row */}
            <div className="flex flex-col gap-3 mb-5">
                {lead.address && (
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <MapPin className="w-3.5 h-3.5 text-white/50" />
                        <span className="truncate">{lead.address}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-white/50" />
                    <span>Last active 2h ago</span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                    {lead.phone && (
                        <button
                            onClick={() => onAction('call', lead.id)}
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black text-zinc-400 transition-all duration-300"
                            title="Call"
                        >
                            <Phone className="w-4 h-4" />
                        </button>
                    )}
                    {lead.email && (
                        <button
                            onClick={() => onAction('email', lead.id)}
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black text-zinc-400 transition-all duration-300"
                            title="Email"
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                    )}
                    {lead.website && (
                        <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black text-zinc-400 transition-all duration-300"
                            title="Visit Website"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <Link
                    href={`/leads/${lead.id}`}
                    className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 inline-flex items-center"
                >
                    View
                </Link>
            </div>
        </motion.div>
    );
}
