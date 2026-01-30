"use client";

import { useState } from "react";
import { Sparkles, Copy, Send, RefreshCw } from "lucide-react";
import { Lead } from "@/types/lead";
import { toast } from "sonner";

interface OutreachPanelProps {
    lead: any; // Using any for simplicity with Supabase types for now
}

export function OutreachPanel({ lead }: OutreachPanelProps) {
    const [message, setMessage] = useState(lead.suggested_message || "");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleRegenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: lead.id,
                    leadContext: {
                        businessName: lead.business_name,
                        industry: lead.industry,
                        painPoint: lead.pain_point,
                        description: lead.address // Using address as proxy for description if missing
                    }
                })
            });

            const data = await res.json();
            if (data.message) {
                setMessage(data.message);
                toast.success("Draft Generated", { description: "AI has crafted a new message." });
            } else if (data.error && data.isConfigError) {
                toast.error("Configuration Error", { description: "Please set GEMINI_API_KEY in .env.local" });
            }
        } catch (error) {
            console.error("Failed to generate", error);
            toast.error("Generation Failed", { description: "Could not connect to AI service." });
        }
        setIsGenerating(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        toast.success("Copied to Clipboard");
    };

    return (
        <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">Suggested Outreach</h2>
                        <p className="text-xs text-zinc-500">Tailored message based on pain point.</p>
                    </div>
                </div>
                <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5 disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Thinking...' : 'Regenerate'}
                </button>
            </div>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-white/20 resize-none font-mono min-h-[200px]"
                placeholder="AI generated message will appear here..."
            />

            <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-colors"
                >
                    <Copy className="w-4 h-4" /> Copy
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                    <Send className="w-4 h-4" /> Send Email
                </button>
            </div>
        </div>
    );
}
