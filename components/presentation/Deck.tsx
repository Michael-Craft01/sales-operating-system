'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Sparkles, Loader2 } from 'lucide-react';
import { ROICalculator } from './ROICalculator';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { generateDeck } from '@/app/actions/generate-deck';
import confetti from 'canvas-confetti';

export function Deck({ lead }: { lead: any }) {
    const [slide, setSlide] = useState(0);
    const router = useRouter();
    const [closing, setClosing] = useState(false);
    const [analyzing, setAnalyzing] = useState(!lead.presentation_data);
    const [data, setData] = useState<any>(lead.presentation_data || null);

    useEffect(() => {
        if (!data) {
            // Trigger AI Generation
            generateDeck(lead.id).then((res) => {
                if (res.success) {
                    setData(res.data);
                    setAnalyzing(false);
                    router.refresh();
                }
            });
        }
    }, [lead.id, data, router]);

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />
                <div className="text-center">
                    <h3 className="text-xl font-bold font-serif italic mb-1">Analyzing {lead.business_name}...</h3>
                    <p className="text-zinc-500 text-sm">Identifying growth bottlenecks & opportunities</p>
                </div>
            </div>
        );
    }

    // Define Slides
    const slides = [
        // 1. The Hook
        <div key="hook" className="text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-block px-4 py-2 border border-white/20 rounded-full text-zinc-400 text-sm uppercase tracking-widest"
            >
                Proposal For
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif italic text-white mb-8"
            >
                {lead.business_name}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-500 text-xl font-light"
            >
                {data?.hook || "Let's redefine your future."}
            </motion.p>
        </div>,

        // 2. The Diagnosis (AI Generated Slide 1)
        <div key="diagnosis" className="max-w-4xl mx-auto w-full text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-5xl font-bold text-white mb-6 font-serif italic">{data?.slides[0].title}</h2>
                <p className="text-2xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    {data?.slides[0].subtitle}
                </p>
            </motion.div>
        </div>,

        // 3. The Solution (AI Generated Slide 2)
        <div key="solution" className="max-w-4xl mx-auto w-full text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-5xl font-bold text-white mb-6 font-serif italic">{data?.slides[1].title}</h2>
                <p className="text-2xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    {data?.slides[1].subtitle}
                </p>
            </motion.div>
        </div>,

        // 4. The Vision (AI Generated Slide 3)
        <div key="vision" className="max-w-4xl mx-auto w-full text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-5xl font-bold text-white mb-6 font-serif italic">{data?.slides[2].title}</h2>
                <p className="text-2xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    {data?.slides[2].subtitle}
                </p>
            </motion.div>
        </div>,

        // 5. The ROI
        <div key="roi" className="w-full">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">The Investment</h2>
            <ROICalculator />
        </div>,

        // 6. The Close
        <div key="close" className="text-center">
            <h2 className="text-5xl font-serif italic text-white mb-8">Ready to begin?</h2>
            <p className="text-zinc-500 mb-12 text-xl">Let's make this official.</p>

            <button
                onClick={handleCloseDeal}
                disabled={closing}
                className="group relative px-12 py-6 bg-white text-black text-xl font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
            >
                {closing ? 'Processing...' : 'Accept Proposal'}
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>
        </div>
    ];

    async function handleCloseDeal() {
        setClosing(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffffff', '#a1a1aa', '#52525b']
        });

        try {
            await supabase.from('leads').update({ stage: 'ClosedWon' }).eq('id', lead.id);

            // Wait for confetti
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (e) {
            console.error(e);
            setClosing(false);
        }
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto h-[80vh] flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex items-center justify-center flex-1"
                >
                    {slides[slide]}
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-12 py-8">
                <button
                    onClick={() => setSlide(Math.max(0, slide - 1))}
                    disabled={slide === 0}
                    className="p-4 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white disabled:opacity-0 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === slide ? 'bg-white' : 'bg-zinc-800'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}
                    disabled={slide === slides.length - 1}
                    className="p-4 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white disabled:opacity-0 transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
