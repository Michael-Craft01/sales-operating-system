'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export function GoalModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: () => void }) {
    const [formData, setFormData] = useState({
        type: 'Monthly',
        description: '',
        target_date: '',
        amount: '',
        target_count: '',
        scope: ''
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        // Parse numbers before sending
        const payload = {
            ...formData,
            amount: formData.amount ? parseFloat(formData.amount) : null,
            target_count: formData.target_count ? parseInt(formData.target_count) : null
        };

        const { error } = await supabase.from('goals').insert([payload]);

        if (!error) {
            onSave();
            setFormData({ type: 'Monthly', description: '', target_date: '', amount: '', target_count: '', scope: '' });
            onClose();
        } else {
            console.error("Save error:", error);
            alert("Failed to save. Did you run the SQL migration?");
        }
        setLoading(false);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Set a New Mission</h2>
                <p className="text-xs text-zinc-500 mb-6">Don't be boring. Think big.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Timeline</label>
                            <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Monthly</option>
                                <option>Quarterly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Deadline</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white"
                                value={formData.target_date}
                                onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">The Objective</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Dominate the Q3 Market"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white placeholder:text-zinc-700"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-emerald-500 uppercase mb-1.5">The Bag ($)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-zinc-700 font-mono"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-indigo-400 uppercase mb-1.5">Kill Count (Units)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-zinc-700 font-mono"
                                value={formData.target_count}
                                onChange={e => setFormData({ ...formData, target_count: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Scope / Strategy</label>
                        <textarea
                            rows={2}
                            placeholder="How are we gonna pull this off?"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white placeholder:text-zinc-700 resize-none"
                            value={formData.scope}
                            onChange={e => setFormData({ ...formData, scope: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors mt-2"
                    >
                        {loading ? 'Locking it in...' : 'Commit to Mission'}
                    </button>
                </form>
            </div>
        </div>
    );
}
