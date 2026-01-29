"use client";

import { MapPin, Globe, Phone, Mail, Building, Edit2 } from "lucide-react";
import { logActivity } from "@/app/actions";

interface BusinessCardProps {
    lead: any;
}

export function BusinessCard({ lead }: BusinessCardProps) {
    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-zinc-400 tracking-wider uppercase">Business Info</h2>
                <button className="text-xs text-zinc-500 hover:text-white"><Edit2 className="w-3 h-3" /></button>
            </div>

            <div className="space-y-3">
                <InfoRow icon={MapPin} value={lead.address} label="Address" />
                <InfoRow
                    icon={Globe}
                    value={lead.website}
                    label="Website"
                    isLink
                    onClick={() => logActivity(lead.id, 'Visit Website', { url: lead.website })}
                />
                <InfoRow
                    icon={Phone}
                    value={lead.phone}
                    label="Phone"
                    isLink
                    href={`tel:${lead.phone}`}
                    onClick={() => logActivity(lead.id, 'Call', { phone: lead.phone })}
                />
                <InfoRow
                    icon={Mail}
                    value={lead.email}
                    label="Email"
                    isLink
                    href={`mailto:${lead.email}`}
                    onClick={() => logActivity(lead.id, 'Email', { email: lead.email })}
                />
                <InfoRow icon={Building} value={lead.industry} label="Industry" />
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, value, label, isLink, href, onClick }: any) {
    if (!value) return null;

    return (
        <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group">
            <Icon className="w-4 h-4 text-zinc-500 mt-0.5 group-hover:text-zinc-300" />
            <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">{label}</p>
                {isLink ? (
                    <a
                        href={href || (value.startsWith('http') ? value : `https://${value}`)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={onClick}
                        className="text-sm text-zinc-300 hover:text-white hover:underline truncate block"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm text-zinc-300 truncate">{value}</p>
                )}
            </div>
        </div>
    )
}
