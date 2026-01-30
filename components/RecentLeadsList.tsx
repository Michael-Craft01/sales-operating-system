'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Search, SlidersHorizontal, MoreHorizontal, Calendar, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RecentLeadsList({ leads }: { leads: any[] }) {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter Logic
    const filteredLeads = useMemo(() => {
        let result = [...(leads || [])];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(l =>
                (l.business_name || '').toLowerCase().includes(q) ||
                (l.industry || '').toLowerCase().includes(q) ||
                (l.stage || '').toLowerCase().includes(q)
            );
        }
        // Sort by newest by default
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return result.slice(0, 12);
    }, [leads, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white font-serif italic">Recent Signals</h2>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-zinc-400 font-mono">
                        {filteredLeads.length} Total
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-full border border-zinc-800">
                    <div className="relative">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none text-sm text-white focus:ring-0 pl-9 pr-2 w-32 md:w-48 placeholder:text-zinc-600 focus:outline-none"
                        />
                    </div>
                    <div className="w-px h-4 bg-zinc-800" />
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                            <div className="bg-current rounded-[1px]" />
                            <div className="bg-current rounded-[1px]" />
                            <div className="bg-current rounded-[1px]" />
                            <div className="bg-current rounded-[1px]" />
                        </div>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <div className="flex flex-col gap-0.5 w-3.5 h-3.5 justify-center">
                            <div className="bg-current h-[2px] w-full rounded-full" />
                            <div className="bg-current h-[2px] w-full rounded-full" />
                            <div className="bg-current h-[2px] w-full rounded-full" />
                        </div>
                    </button>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-2"}>
                    {filteredLeads.map((lead, i) => (
                        <Link key={lead.id} href={`/leads/${lead.id}/onboarding`}>
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: i * 0.05 }}
                                className={`
                            group relative overflow-hidden backdrop-blur-xl
                            ${viewMode === 'grid'
                                        ? 'bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col h-full min-h-[180px] hover:bg-white/10 hover:border-white/20'
                                        : 'bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 hover:border-white/20'
                                    }
                            transition-all duration-300 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_-1px_rgba(0,0,0,0.2)]
                        `}
                            >
                                {viewMode === 'grid' ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 text-zinc-400 font-bold group-hover:bg-white group-hover:text-black transition-colors">
                                                {lead.business_name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${lead.stage === 'New' ? 'border-white text-black bg-white' :
                                                    lead.stage === 'ClosedWon' ? 'border-zinc-700 text-white bg-zinc-800' :
                                                        'border-zinc-800 text-zinc-500 bg-black'
                                                }`}>
                                                {lead.stage}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-zinc-300 transition-colors truncate">
                                            {lead.business_name}
                                        </h3>
                                        <p className="text-zinc-500 text-sm mb-6 line-clamp-2">
                                            {lead.industry || 'No Industry'} • {lead.pain_point || 'No context yet'}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="text-xs text-zinc-600 font-mono">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-600 -rotate-45 group-hover:rotate-0 group-hover:text-white transition-all" />
                                        </div>

                                        {/* Hover Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 text-zinc-400 font-bold group-hover:bg-white group-hover:text-black transition-colors">
                                                {lead.business_name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm group-hover:text-zinc-300 transition-colors">
                                                    {lead.business_name}
                                                </h3>
                                                <p className="text-zinc-500 text-xs">
                                                    {lead.industry} • {lead.stage}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                    </>
                                )}
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </AnimatePresence>

            {filteredLeads.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>No signals found.</p>
                </div>
            )}
        </div>
    );
}
