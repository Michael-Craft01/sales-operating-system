"use client";

import { MapPin, Globe, Phone, Mail, Building2, ExternalLink, Copy, Check } from "lucide-react";
import { logActivity } from "@/app/actions";
import { useState } from "react";

interface BusinessCardProps {
    lead: any;
}

export function BusinessCard({ lead }: BusinessCardProps) {
    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full group">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg text-white">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">{lead.business_name}</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{lead.industry || "Unknown Industry"}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex-1">
                <InfoItem
                    icon={MapPin}
                    label="Headquarters"
                    value={lead.address}
                />

                <div className="grid grid-cols-1 gap-4 pt-2">
                    <ActionRow
                        icon={Globe}
                        label="Website"
                        value={lead.website}
                        action={() => logActivity(lead.id, 'Visit Website', { url: lead.website })}
                        type="link"
                    />
                    <ActionRow
                        icon={Phone}
                        label="Phone"
                        value={lead.phone}
                        action={() => logActivity(lead.id, 'Call', { phone: lead.phone })}
                        type="phone"
                    />
                    <ActionRow
                        icon={Mail}
                        label="Email"
                        value={lead.email}
                        action={() => logActivity(lead.id, 'Email', { email: lead.email })}
                        type="email"
                    />
                </div>
            </div>

            {/* Footer / Status */}
            <div className="px-6 py-3 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                <span>Database ID: {lead.id ? lead.id.slice(0, 8) : 'N/A'}...</span>
                <span className="flex items-center gap-1 text-zinc-400"><div className="w-1.5 h-1.5 rounded-full bg-white" /> Active Lead</span>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: any) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all group">
            <Icon className="w-4 h-4 text-zinc-600 mt-0.5 group-hover:text-white transition-colors" />
            <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-zinc-300 font-medium leading-normal">{value}</p>
            </div>
        </div>
    );
}

function ActionRow({ icon: Icon, label, value, action, type }: any) {
    const [copied, setCopied] = useState(false);

    if (!value) return null;

    const handleCopy = (e: any) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    let href = value;
    if (type === 'email') href = `mailto:${value}`;
    if (type === 'phone') href = `tel:${value}`;
    if (type === 'link' && !value.startsWith('http')) href = `https://${value}`;

    return (
        <div className="group flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
                if (type === 'link') window.open(href, '_blank');
                if (type === 'email' || type === 'phone') window.location.href = href;
                if (action) action();
            }}
        >
            <div className="flex items-center gap-3 relative z-10 w-full overflow-hidden">
                <div className="p-2 bg-black/40 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-zinc-200 font-medium truncate group-hover:text-white transition-colors">
                        {value}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
            </div>
        </div>
    )
}
