'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ROICalculator() {
    const [hoursSaved, setHoursSaved] = useState(10);
    const [hourlyRate, setHourlyRate] = useState(50);
    const [closingRate, setClosingRate] = useState(20);

    const weeklySavings = hoursSaved * hourlyRate;
    const yearlySavings = weeklySavings * 52;
    const extraRevenue = (hoursSaved / 2) * (hourlyRate * 5); // Assumption: half saved time goes to sales

    return (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div>
                    <label className="block text-zinc-500 mb-2 uppercase tracking-wider text-xs font-bold">Hours Wasted Weekly</label>
                    <input
                        type="range"
                        min="1" max="50"
                        value={hoursSaved}
                        onChange={(e) => setHoursSaved(Number(e.target.value))}
                        className="w-full accent-white h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-white font-mono text-2xl mt-2">{hoursSaved} hours</div>
                </div>

                <div>
                    <label className="block text-zinc-500 mb-2 uppercase tracking-wider text-xs font-bold">Avg. Hourly Value</label>
                    <input
                        type="range"
                        min="20" max="500" step="10"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full accent-white h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-white font-mono text-2xl mt-2">${hourlyRate}/hr</div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-zinc-400 font-serif italic text-xl mb-6">The Cost of Inaction</h3>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-zinc-500">Weekly Loss</span>
                        <span className="text-2xl font-mono text-zinc-300">${weeklySavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-zinc-500">Yearly Loss</span>
                        <span className="text-2xl font-mono text-zinc-300">${yearlySavings.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10 my-4" />
                    <div className="flex justify-between items-end">
                        <span className="text-white font-bold text-lg">Potential Gain</span>
                        <motion.span
                            key={yearlySavings}
                            initial={{ scale: 1.2, color: '#fff' }}
                            animate={{ scale: 1, color: '#fff' }}
                            className="text-4xl font-mono font-bold"
                        >
                            ${(yearlySavings + extraRevenue).toLocaleString()}
                        </motion.span>
                    </div>
                </div>
            </div>
        </div>
    );
}
