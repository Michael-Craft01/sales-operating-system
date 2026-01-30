"use client";

import { useState } from "react";
import { FileText, Sparkles, Download, Printer } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';

export function OnboardingDocGenerator({ leadContext }: { leadContext: any }) {
    const [docContent, setDocContent] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setIsEditing(false); // Reset edit mode on regeneration
        try {
            const res = await fetch("/api/ai/doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadContext: leadContext,
                    docType: "onboarding"
                }),
            });
            const data = await res.json();
            if (data.document) {
                setDocContent(data.document);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Onboarding Letter - ${leadContext.business_name}</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                            body { 
                                font-family: 'Times New Roman', Times, serif; 
                                padding: 60px; 
                                line-height: 1.6; 
                                color: #000; 
                                background: white;
                                max-width: 800px;
                                margin: 0 auto;
                                font-size: 12pt;
                            }
                            .letter-content { white-space: pre-wrap; }
                            @media print {
                                body { padding: 40px; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="letter-content">${docContent}</div>
                        <script>
                            window.onload = function() { window.print(); }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const handleDownloadPDF = async () => {
        if (typeof window === 'undefined') return;

        // Dynamic import to avoid SSR issues
        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.createElement('div');
        element.innerHTML = `
            <div style="font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.6; font-size: 12pt;">
                <div style="white-space: pre-wrap;">${docContent}</div>
            </div>
        `;

        const opt = {
            margin: [1, 1, 1, 1],
            filename: `Onboarding_Letter_${(leadContext.business_name || leadContext.businessName || 'Client').replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Onboarding Letter
                </h3>
                <div className="flex gap-2">
                    {docContent && (
                        <>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${isEditing ? 'text-white bg-white/10' : 'text-zinc-400'}`}
                                title={isEditing ? "Save Edits" : "Edit Document"}
                            >
                                <Sparkles className={`w-4 h-4 ${isEditing ? 'text-emerald-400' : ''}`} />
                                {/* NOTE: Reusing Sparkles as generic icon or importing Edit/Save would be better, but sticking to existing imports for speed unless I add new ones. 
                                    Wait, I should import Edit/Save. Let me stick to just text toggle or reuse known icon for now to avoid import errors if I don't see top.
                                    Actually I can use Sparkles as placeholder or just text.
                                    Better: I will just use the toggle logic and maybe add Edit icon import in next step if needed. 
                                    actually, let's just use text for the button content or reuse existing icons safely.
                                 */}
                                <span className="text-xs font-bold">{isEditing ? "Done" : "Edit"}</span>
                            </button>

                            <button
                                onClick={handlePrint}
                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                title="Print Document"
                            >
                                <Printer className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                                title="Save as PDF"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                    >
                        {loading ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {docContent ? "Regenerate" : "Generate"}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-0 bg-white custom-scrollbar relative flex flex-col">
                {docContent ? (
                    isEditing ? (
                        <textarea
                            className="flex-1 w-full h-full p-8 font-serif text-black leading-relaxed text-sm resize-none focus:outline-none"
                            value={docContent}
                            onChange={(e) => setDocContent(e.target.value)}
                        />
                    ) : (
                        <div className="p-8 whitespace-pre-wrap font-serif text-black leading-relaxed text-sm">
                            {docContent}
                        </div>
                    )
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 space-y-3 bg-zinc-900/50">
                        <FileText className="w-8 h-8 opacity-20" />
                        <p className="text-sm">No onboarding letter generated yet.</p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="text-xs text-white hover:text-zinc-300 hover:underline disabled:no-underline disabled:opacity-50"
                        >
                            Click to generate via AI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
