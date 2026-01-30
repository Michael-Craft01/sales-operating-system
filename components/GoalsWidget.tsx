'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GoalModal } from './GoalModal';
import { Plus, Target, CheckCircle2 } from 'lucide-react';

export function GoalsWidget() {
    const [goals, setGoals] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchGoals() {
        try {
            const { data } = await supabase
                .from('goals')
                .select('*')
                .eq('status', 'Active')
                .order('created_at', { ascending: false });

            setGoals(data || []);
        } catch (e) {
            console.log('Error fetching goals', e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">The Mission</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {goals.map((goal) => (
                    <div key={goal.id} className="p-5 rounded-3xl bg-zinc-900/50 border border-zinc-800 relative overflow-hidden group">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-800 bg-black/50">
                                    {goal.type}
                                </span>
                                {goal.status === 'Completed' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Target className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                )}
                            </div>

                            <h4 className="text-white font-bold text-lg mb-1">{goal.description}</h4>
                            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{goal.scope || 'No scope defined.'}</p>

                            <div className="flex items-center gap-4 text-sm">
                                {goal.amount && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-600 uppercase font-bold">Bag</span>
                                        <span className="text-emerald-400 font-mono font-bold">${goal.amount.toLocaleString()}</span>
                                    </div>
                                )}
                                {goal.target_count && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-600 uppercase font-bold">Target</span>
                                        <span className="text-white font-mono font-bold">{goal.target_count} Units</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end">
                                <span className="text-xs text-zinc-600">
                                    Due {new Date(goal.target_date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {goals.length === 0 && !loading && (
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="p-6 border border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 cursor-pointer transition-all"
                    >
                        <p className="text-sm">No active missions.</p>
                        <p className="text-xs mt-1">Click + to set a target.</p>
                    </div>
                )}
            </div>

            <GoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {
                    fetchGoals();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}
