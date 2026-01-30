'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Search, SlidersHorizontal } from 'lucide-react';

export function RecentLeadsList({ leads }: { leads: any[] }) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'stage'>('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Filter and Sort Logic
    const filteredLeads = useMemo(() => {
        let result = [...(leads || [])];

        // 1. Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(l =>
                (l.business_name || '').toLowerCase().includes(q) ||
                (l.industry || '').toLowerCase().includes(q) ||
                (l.stage || '').toLowerCase().includes(q)
            );
        }

        // 2. Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'name':
                    return (a.business_name || '').localeCompare(b.business_name || '');
                case 'stage':
                    return (a.stage || '').localeCompare(b.stage || '');
                default:
                    return 0;
            }
        });

        return result.slice(0, 10); // Show max 10 for performance on dashboard
    }, [leads, search, sortBy]);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <h2 className="text-lg font-semibold text-white">Recent Signals</h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 hover:border-zinc-700 transition-colors w-32 focus:w-48"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-1.5 rounded-full border transition-all ${showFilters ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="mb-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex gap-4 overflow-x-auto">
                    <button onClick={() => setSortBy('newest')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${sortBy === 'newest' ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}>Newest</button>
                    <button onClick={() => setSortBy('oldest')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${sortBy === 'oldest' ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}>Oldest</button>
                    <button onClick={() => setSortBy('stage')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${sortBy === 'stage' ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}>By Stage</button>
                    <button onClick={() => setSortBy('name')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${sortBy === 'name' ? 'bg-white text-black border-white' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}>Name A-Z</button>
                </div>
            )}

            <div className="bg-black rounded-3xl border border-zinc-900 overflow-hidden">
                {/* Results Header */}
                <div className="px-4 py-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/30">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        {filteredLeads.length} {filteredLeads.length === 1 ? 'Result' : 'Results'}
                        {leads.length > filteredLeads.length && ` (of ${leads.length})`}
                    </span>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {filteredLeads.length > 0 ? (
                    <div>
                        {filteredLeads.map((lead: any) => (
                            <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors border-b border-zinc-900 last:border-0 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-black transition-all text-sm font-bold border border-zinc-800 shrink-0">
                                        {lead.business_name ? lead.business_name.substring(0, 2).toUpperCase() : "??"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors truncate">
                                            {lead.business_name || "Unknown Business"}
                                        </p>
                                        <p className="text-xs text-zinc-600 flex items-center gap-2 mt-0.5">
                                            <span className="truncate max-w-[100px]">{lead.industry || "General"}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-800 shrink-0" />
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${lead.stage === 'ClosedWon' ? 'bg-white text-black' :
                                                    lead.stage === 'ClosedLost' ? 'bg-red-500/10 text-red-500' :
                                                        lead.stage === 'New' ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                {lead.stage}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Link href={`/leads/${lead.id}`} className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-lg transition-all shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}

                        {/* Footer Link */}
                        <Link
                            href="/leads"
                            className="block p-3 text-center text-xs text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors border-t border-zinc-900 font-mono uppercase tracking-widest"
                        >
                            View Full Database
                        </Link>
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-500 text-sm flex flex-col items-center">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <p>No matches found.</p>
                        <button onClick={() => { setSearch(''); setShowFilters(false); }} className="mt-2 text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">
                            Reset filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
