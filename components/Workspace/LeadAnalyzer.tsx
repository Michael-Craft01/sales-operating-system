"use client";

import { useState, useEffect } from "react";
import { Sparkles, Code2, DollarSign, BrainCircuit, RefreshCw, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

interface AnalysisResult {
    budget_estimate: string;
    tech_stack: string[];
    dev_translation: string;
}

export function LeadAnalyzer({ lead }: { lead: any }) {
    // Start strictly loading so we show skeleton immediately
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead }),
            });
            const data = await res.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
            }
        } catch (e) {
            console.error("Analysis failed", e);
        } finally {
            setLoading(false);
        }
    };

    // Auto-Run on Mount
    useEffect(() => {
        handleAnalyze();
    }, []);

    return (
        <>
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-20" />

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" />
                            Strategic Analysis
                        </h3>
                        {!loading && analysis && (
                            <button
                                onClick={handleAnalyze}
                                className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Refresh
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6 animate-pulse"
                            >
                                {/* Budget Skeleton */}
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="w-24 h-3 bg-white/10 rounded"></div>
                                        <div className="w-32 h-6 bg-white/10 rounded"></div>
                                    </div>
                                </div>

                                {/* Tech Stack Skeleton */}
                                <div className="space-y-3">
                                    <div className="w-32 h-3 bg-white/10 rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="w-20 h-6 bg-white/10 rounded-full"></div>
                                        <div className="w-24 h-6 bg-white/10 rounded-full"></div>
                                        <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Translation Skeleton */}
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                                    <div className="w-40 h-3 bg-white/20 rounded"></div>
                                    <div className="w-full h-3 bg-white/5 rounded"></div>
                                </div>
                            </motion.div>
                        ) : analysis ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Budget Section */}
                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors">
                                    <div className="p-3 bg-white/10 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium">ESTIMATED VALUE</p>
                                        <p className="text-xl font-bold text-white tracking-tight">{analysis.budget_estimate}</p>
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase">
                                        <Code2 className="w-4 h-4" />
                                        Recommended Stack
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.tech_stack.map((tech, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Translation Trigger */}
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 flex flex-col items-start cursor-pointer hover:bg-white/10 transition-colors"
                                    onClick={() => setShowModal(true)}>
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-xs text-zinc-400 font-bold uppercase">Developer Translation</p>
                                        <Eye className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="text-sm text-zinc-400 line-clamp-2 prose prose-invert prose-p:my-0 prose-strong:text-zinc-300">
                                        <ReactMarkdown allowedElements={["p", "strong", "em", "li", "span"]}>
                                            {analysis.dev_translation}
                                        </ReactMarkdown>
                                    </div>
                                    <button className="text-xs text-white font-bold mt-1">Click to view full</button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-zinc-500 text-xs">
                                Failed to load analysis.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {showModal && analysis && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Code2 className="w-5 h-5 text-white" />
                                    Technical Breakdown
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="text-zinc-300 leading-relaxed font-mono text-sm bg-black/30 p-6 rounded-xl border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <article className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-zinc-300 prose-strong:text-white prose-ul:list-disc prose-li:marker:text-white">
                                    <ReactMarkdown>{analysis.dev_translation}</ReactMarkdown>
                                </article>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
