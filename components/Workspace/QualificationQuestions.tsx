"use client";

import { useState, useEffect } from "react";
import { ListChecks, Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QualificationQuestions({ lead }: { lead: any }) {
    const [questions, setQuestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ai/qualify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead }),
            });
            const data = await res.json();
            if (data.questions) {
                setQuestions(data.questions);
            }
        } catch (e) {
            console.error("Failed to fetch questions", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Discovery Guide
                </h3>
                <button
                    onClick={fetchQuestions}
                    disabled={loading}
                    className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 bg-white/5 rounded shrink-0" />
                                    <div className="flex-1 bg-white/5 h-4 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            {questions.map((q, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded bg-white/5 text-[10px] text-zinc-500 font-mono shrink-0 border border-white/5 group-hover:border-white/20 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-zinc-300 leading-relaxed font-medium flex-1 pt-0.5">
                                        {q}
                                    </p>
                                    <button
                                        onClick={() => handleCopy(q, i)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white"
                                        title="Copy Question"
                                    >
                                        {copiedIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
