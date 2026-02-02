'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Trophy, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { terminateLead } from '@/app/actions/terminate-lead';
import { createNotification } from '@/app/actions/notifications';
import { checkGoalProgress } from '@/app/actions/engagement';

export function ClosingZone({ leadId }: { leadId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleWon = async () => {
        setLoading(true);
        try {
            // Trigger Confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            // Update DB
            const { error } = await supabase
                .from('leads')
                .update({ stage: 'ClosedWon', status: 'Won' })
                .eq('id', leadId);

            if (error) throw error;

            // Trigger Goal Check
            const progress = await checkGoalProgress();

            if (progress && progress.isClose) {
                await createNotification({
                    type: 'info',
                    title: 'Finish Line in Sight',
                    message: `You are at ${Math.round(progress.progress * 100)}% of your goal. Only $${(progress.targetAmount - progress.currentAmount).toLocaleString()} to go!`,
                    link: '#'
                });
            } else {
                // Standard Victory Notification
                await createNotification({
                    type: 'success',
                    title: 'Mission Accomplished',
                    message: 'Deal secured. Revenue has been recorded.',
                    link: `/leads/${leadId}/presentation`
                });
            }

            toast.success("Deal Closed!", {
                description: "Congratulations. Revenue secured."
            });

            router.refresh();
            router.push('/leads');
        } catch (e) {
            toast.error("Error", { description: "Failed to close deal." });
        } finally {
            setLoading(false);
        }
    };

    const handleLost = async () => {
        if (!confirm("Are you sure you want to mark this deal as lost? This will permanently delete the lead.")) return;

        setLoading(true);
        try {
            const res = await terminateLead(leadId);
            if (!res.success) throw new Error(res.error);

            toast("Lead Deleted", {
                description: "The lead has been permanently removed from the system."
            });

            router.refresh();
            router.push('/leads');
        } catch (e) {
            toast.error("Error", { description: "Failed to delete lead." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* WON Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl p-1"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full bg-zinc-950/90 backdrop-blur-xl rounded-[22px] p-8 border border-white/10 flex flex-col items-center text-center justify-between gap-8 group-hover:border-white/30 transition-colors shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-black transition-all duration-500">
                        <Trophy className="w-10 h-10 text-white group-hover:text-black transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">Close Deal</h3>
                        <p className="text-zinc-500">Mark this opportunity as WON and record revenue.</p>
                    </div>
                    <button
                        onClick={handleWon}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Confirm Win"}
                    </button>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            </motion.div>

            {/* LOST Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl p-1"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full bg-zinc-950/90 backdrop-blur-xl rounded-[22px] p-8 border border-white/5 flex flex-col items-center text-center justify-between gap-8 group-hover:border-white/20 transition-colors shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-all duration-500">
                        <XCircle className="w-10 h-10 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-zinc-400 group-hover:text-white transition-colors mb-2">Mark Lost</h3>
                        <p className="text-zinc-600">Archive this lead and document reasons for loss.</p>
                    </div>
                    <button
                        onClick={handleLost}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-transparent border border-zinc-800 text-zinc-500 font-bold text-lg hover:text-white hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Confirm Loss"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
