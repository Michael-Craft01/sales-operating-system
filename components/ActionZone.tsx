'use client';

import { ArrowRight, Phone, Mail, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ActionZone({ leads }: { leads: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // If no leads at all
    if (!leads || leads.length === 0) return (
        <div className="bg-black border border-zinc-800 rounded-3xl p-8 text-center">
            <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3 opacity-50" />
            <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
            <p className="text-zinc-500 text-sm mt-2">No pending actions required. Go find some new leads.</p>
        </div>
    );

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % leads.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + leads.length) % leads.length);
    };

    const lead = leads[currentIndex];

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 group min-h-[300px] flex flex-col justify-center shadow-[0_8px_32px_-1px_rgba(0,0,0,0.3)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-opacity">
                <Sparkles className="w-32 h-32 text-white" />
            </div>

            {/* Carousel Controls */}
            {leads.length > 1 && (
                <div className="absolute top-8 right-8 flex gap-2 z-20">
                    <button
                        onClick={prevSlide}
                        className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            <AnimatePresence mode='wait'>
                <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                            Priority #{currentIndex + 1}
                        </span>
                        <span className="text-zinc-500 text-xs">Based on {lead.stage} urgency</span>
                        {leads.length > 1 && (
                            <span className="text-zinc-700 text-xs font-mono ml-auto mr-24">
                                {currentIndex + 1} / {leads.length}
                            </span>
                        )}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-2">
                        Reach out to <span className="text-zinc-300">{lead.business_name}</span>
                    </h2>
                    <p className="text-zinc-500 max-w-xl text-lg">
                        They are currently in <strong className="text-zinc-300">{lead.stage}</strong> and haven't been touched recently.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-8">
                        <Link href={`/leads/${lead.id}/onboarding`} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors">
                            Open Workspace <ArrowRight className="w-4 h-4" />
                        </Link>
                        {lead.phone && (
                            <button className="flex items-center gap-2 bg-transparent text-zinc-300 border border-zinc-700 px-6 py-3 rounded-full font-medium hover:text-white hover:border-white transition-colors">
                                <Phone className="w-4 h-4" /> Call
                            </button>
                        )}
                        {lead.email && (
                            <button className="flex items-center gap-2 bg-transparent text-zinc-300 border border-zinc-700 px-6 py-3 rounded-full font-medium hover:text-white hover:border-white transition-colors">
                                <Mail className="w-4 h-4" /> Email
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
