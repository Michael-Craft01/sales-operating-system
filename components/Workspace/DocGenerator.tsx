"use client";

import { useState } from "react";
import { FileText, Loader2, Download, Copy, ChevronDown } from "lucide-react";
import { DocType } from "@/lib/gemini";
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
// Note: We'll simple text rendering or simple MD parser if package not present
// For robustness, I'll use a simple wrapper that assumes plain text marking down or install a package later.
// Let's assume we render raw text nicely for now.

interface DocGeneratorProps {
    leadContext: any;
}

export function DocGenerator({ leadContext }: DocGeneratorProps) {
    const [docType, setDocType] = useState<DocType>('proposal');
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setContent("");

        try {
            const res = await fetch('/api/ai/doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadContext: {
                        businessName: leadContext.business_name,
                        industry: leadContext.industry,
                        painPoint: leadContext.pain_point,
                        description: leadContext.address
                    },
                    docType: docType
                })
            });

            const data = await res.json();
            if (data.document) {
                setContent(data.document);
                toast.success("Document Created", { description: `${docType} generated successfully.` });
            } else {
                toast.error("Generation Failed", { description: data.error || "Unknown error" });
            }
        } catch (e) {
            console.error(e);
            toast.error("Network Error", { description: "Could not reach the server." });
        }
        setLoading(false);
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">AI Document Generator</h2>
                        <p className="text-xs text-zinc-500">Create tailored sales assets instantly.</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as DocType)}
                        className="bg-black/40 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                    >
                        <option value="proposal">Sales Proposal</option>
                        <option value="audit">Audit Report</option>
                        <option value="onboarding">Onboarding Plan</option>
                    </select>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <SparklesIcon />}
                        {loading ? "Drafting..." : "Generate"}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-6 overflow-y-auto font-mono text-sm text-zinc-300 leading-relaxed custom-scrollbar">
                {content ? (
                    <div className="whitespace-pre-wrap">{content}</div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3 opacity-50">
                        <FileText className="w-12 h-12 stroke-[1]" />
                        <p>Select a document type and click Generate</p>
                    </div>
                )}
            </div>

            {content && (
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(content);
                            toast.success("Copied Markdown");
                        }}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <Copy className="w-3 h-3" /> Copy Markdown
                    </button>
                </div>
            )}
        </div>
    );
}

function SparklesIcon() {
    return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    )
}
