'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X, Brain } from 'lucide-react';
import { generateDeck } from '@/app/actions/generate-deck';
import { motion, AnimatePresence } from 'framer-motion';

export function AiActionsButton({ lead }: { lead: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // Initialize with existing persisted data if available
    const [data, setData] = useState<any>(lead.presentation_data || null);

    async function handleAnalyze() {
        if (data) return; // Already have data

        setLoading(true);
        try {
            const res = await generateDeck(lead.id); // Uses the same server action
            if (res.success) {
                setData(res.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                    if (!data) handleAnalyze();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-full border border-white/5 transition-all"
            >
                <Sparkles className="w-3 h-3 text-zinc-400" />
                AI Actions
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden relative"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-900 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                        <Brain className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">AI Strategy Brief</h2>
                                        <p className="text-xs text-zinc-500">Persisted insights for {lead.business_name}</p>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                        <p className="text-sm">Analyzing business context...</p>
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">The Hook</h3>
                                            <p className="text-lg font-serif italic text-white">"{data.hook}"</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {data.slides.map((slide: any, i: number) => (
                                                <div key={i} className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                                                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400 mb-3">
                                                        {i + 1}
                                                    </div>
                                                    <h4 className="font-bold text-white text-sm mb-1">{slide.title}</h4>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">{slide.subtitle}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-zinc-500">
                                        Failed to load insights.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
