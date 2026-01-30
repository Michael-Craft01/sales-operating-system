"use client";

import { useState } from "react";
import { FileText, Sparkles, Download, Printer, FileCheck, Calendar, Pencil, Check, RefreshCw, FileType } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SalesDocGeneratorProps {
    leadContext: any;
    docType: 'contract' | 'meeting_plan' | 'proposal' | 'audit' | 'onboarding';
    title: string;
}

export function SalesDocGenerator({ leadContext, docType, title }: SalesDocGeneratorProps) {
    const [docContent, setDocContent] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Determine icon based on docType
    let Icon = FileText;
    if (docType === 'contract') Icon = FileCheck;
    else if (docType === 'meeting_plan') Icon = Calendar;
    else if (docType === 'proposal') Icon = Sparkles;

    const handleGenerate = async () => {
        setLoading(true);
        setIsEditing(false);
        try {
            const res = await fetch("/api/ai/doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadContext: leadContext,
                    docType: docType
                }),
            });
            const data = await res.json();
            if (data.document) {
                // Strip any remaining markdown symbols the AI might have missed
                const cleanText = data.document
                    .replace(/\*\*/g, "") // Bold
                    .replace(/##/g, "")   // Headers
                    .replace(/\*/g, "-")  // Lists
                    .trim();
                setDocContent(cleanText);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const headerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24pt; font-family: 'Times New Roman', serif;">LogicHQ</h1>
            <p style="margin: 5px 0 0; font-size: 10pt; color: #444;">Belvedere, Harare, HIT Institute | +263 719 200 295 | www.logichq.tech</p>
        </div>
    `;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${title} - ${leadContext.business_name}</title>
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
                            @media print {
                                body { padding: 40px; }
                            }
                        </style>
                    </head>
                    <body>
                        ${headerHTML}
                        <div style="white-space: pre-wrap;">${docContent}</div>
                        <script>
                            window.onload = function() { window.print(); }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const handleDownloadDocx = () => {
        const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head>
            <body>
                ${headerHTML}
                <div style="font-family: 'Times New Roman', serif; font-size: 12pt; white-space: pre-wrap;">
                    ${docContent}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', content], {
            type: 'application/msword'
        });

        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);

        if ((navigator as any).msSaveOrOpenBlob) {
            (navigator as any).msSaveOrOpenBlob(blob, `${title}.doc`);
        } else {
            downloadLink.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(content);
            downloadLink.download = `${title}.doc`;
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);
    };

    const handleDownloadPDF = async () => {
        if (typeof window === 'undefined') return;

        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.createElement('div');
        element.innerHTML = `
            <div style="font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.6; font-size: 12pt;">
                ${headerHTML}
                <div style="white-space: pre-wrap;">${docContent}</div>
            </div>
        `;

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5] as any,
            filename: `${docType}_${(leadContext.business_name || 'Client').replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg' as any, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as any }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl shadow-black/50">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    {title}
                </h3>

                <div className="flex items-center gap-2">
                    {docContent && (
                        <div className="flex items-center gap-1 pr-2 border-r border-white/10 mr-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`h-8 px-3 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${isEditing
                                    ? 'bg-white text-black border border-white'
                                    : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                                    }`}
                                title={isEditing ? "Save Edits" : "Edit Document"}
                            >
                                {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                                {isEditing ? "Done" : "Edit"}
                            </button>

                            <button
                                onClick={handleDownloadDocx}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                title="Download Word Doc"
                            >
                                <FileType className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handlePrint}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleDownloadPDF}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                title="Download PDF"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-lg shadow-white/10"
                    >
                        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {docContent ? "Regenerate" : "Draft with AI"}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-zinc-950/50 flex flex-col">
                {docContent ? (
                    isEditing ? (
                        <textarea
                            className="flex-1 w-full h-full p-8 font-serif text-zinc-300 bg-transparent leading-relaxed text-sm resize-none focus:outline-none"
                            value={docContent}
                            onChange={(e) => setDocContent(e.target.value)}
                        />
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-zinc-100 min-h-full shadow-inner">
                            {/* Visual Paper Effect */}
                            <div className="max-w-[800px] mx-auto bg-white min-h-[800px] shadow-xl p-[60px] text-black">
                                {/* Letterhead */}
                                <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
                                    <h1 className="text-3xl font-serif text-slate-900 font-bold tracking-wide">LogicHQ</h1>
                                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] mt-2 font-medium">Belvedere, Harare • +263 719 200 295</p>
                                </div>

                                <div className="whitespace-pre-wrap font-serif text-slate-900 leading-[1.8] text-[11pt]">
                                    {docContent}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    // Premium Empty State
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                            <Icon className="w-10 h-10 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </div>

                        <div className="text-center space-y-2">
                            <h4 className="text-lg font-bold text-white tracking-tight">Ready to Draft</h4>
                            <p className="text-sm text-zinc-500 max-w-[280px]">
                                Generate a professional {title.toLowerCase()} tailored to this lead using AI.
                            </p>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium rounded-xl transition-all"
                        >
                            <Sparkles className="w-4 h-4 text-white group-hover:animate-pulse" />
                            <span>Generate Document</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
