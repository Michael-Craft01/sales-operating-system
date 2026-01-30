"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, CheckCircle, X, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Appointment {
    id: string;
    title: string;
    date: string;
    type: string;
    status: string;
    notes?: string;
}

export function AppointmentManager({ leadId }: { leadId: string }) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newType, setNewType] = useState("Discovery");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize client-side supabase just for this component if context not available
    // In a real app, use a hook. Here we'll rely on the API or local state for now.
    // Actually, let's use a server action or API route for data fetching to be safe, 
    // but for interactivity simple fetch is fine.

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/appointments?leadId=${leadId}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data.appointments || []);
            }
        } catch (e) {
            console.error("Failed to fetch appointments", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [leadId]);

    const handleCreate = async () => {
        if (!newTitle || !newDate) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId,
                    title: newTitle,
                    date: newDate,
                    type: newType,
                    status: 'Scheduled'
                })
            });

            if (res.ok) {
                setIsCreating(false);
                setNewTitle("");
                setNewDate("");
                fetchAppointments(); // Refresh list
            }
        } catch (e) {
            console.error("Failed to create appointment", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Upcoming Sessions</h3>
                    <p className="text-sm text-zinc-400">Manage your schedule with this lead.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4" />
                    New Appointment
                </button>
            </div>

            {/* Create Modal / Form (Inline) */}
            {isCreating && (
                <div className="bg-zinc-900/50 border border-emerald-500/30 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Schedule New Session</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Title</label>
                            <input
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                placeholder="e.g. Discovery Call"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400">Type</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                            >
                                <option value="Discovery">Discovery</option>
                                <option value="Demo">Demo</option>
                                <option value="Contract">Contract Review</option>
                                <option value="Onboarding">Onboarding</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs text-zinc-400">Date & Time</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 color-scheme-dark"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isSubmitting || !newTitle || !newDate}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Schedule
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [...Array(2)].map((_, i) => (
                        <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
                    ))
                ) : appointments.length === 0 ? (
                    <div className="col-span-full h-40 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Calendar className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No scheduled appointments.</p>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <div key={appt.id} className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border ${appt.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        appt.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                    {appt.status}
                                </span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/5 shrink-0">
                                    <span className="text-xs text-zinc-500 uppercase font-bold">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-lg font-bold text-white">{new Date(appt.date).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white leading-tight">{appt.title}</h4>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                        <span>{appt.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
