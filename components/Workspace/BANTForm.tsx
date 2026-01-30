"use client";

import { useState } from "react";
import { updateLeadBANT } from "@/app/actions";
import { DollarSign, UserCheck, Zap, Calendar, Save, Check } from "lucide-react";
import { motion } from "framer-motion";

export function BANTForm({ lead }: { lead: any }) {
    // Initial state from raw_data if available
    const initialBant = lead.raw_data?.bant || {
        budget: "",
        authority: "",
        need: "",
        timing: ""
    };

    const [formData, setFormData] = useState(initialBant);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await updateLeadBANT(lead.id, formData);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    BANT Qualification
                </h3>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 font-bold ${saved
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white text-black hover:bg-zinc-200 border-transparent"
                        }`}
                >
                    {saving ? "Saving..." : saved ? <><Check className="w-3 h-3" /> Saved</> : <><Save className="w-3 h-3" /> Save Progress</>}
                </button>
            </div>

            <div className="p-6 space-y-4">
                <BANTField
                    icon={DollarSign}
                    label="Budget"
                    placeholder="e.g. $2,500 - $5,000 confirmed"
                    value={formData.budget}
                    onChange={(v: string) => handleChange('budget', v)}
                />
                <BANTField
                    icon={UserCheck}
                    label="Authority"
                    placeholder="Who is the decision maker?"
                    value={formData.authority}
                    onChange={(v: string) => handleChange('authority', v)}
                />
                <BANTField
                    icon={Zap}
                    label="Need"
                    placeholder="Defined pain points & requirements..."
                    value={formData.need}
                    onChange={(v: string) => handleChange('need', v)}
                    multiline
                />
                <BANTField
                    icon={Calendar}
                    label="Timing"
                    placeholder="When do they need this by?"
                    value={formData.timing}
                    onChange={(v: string) => handleChange('timing', v)}
                />
            </div>
        </div>
    );
}

function BANTField({ icon: Icon, label, placeholder, value, onChange, multiline }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
                <Icon className="w-3 h-3 text-zinc-600" />
                {label}
            </label>
            {multiline ? (
                <textarea
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-white/20 transition-colors resize-none h-24 placeholder-zinc-700"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type="text"
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-white/20 transition-colors placeholder-zinc-700"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
}
