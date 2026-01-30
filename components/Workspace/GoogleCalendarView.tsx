"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";
import { GoogleCalendarConnect } from "./GoogleCalendarConnect";

interface CalendarEvent {
    id: string;
    summary: string;
    start: { dateTime: string; date?: string };
    end: { dateTime: string; date?: string };
    htmlLink: string;
}

export function GoogleCalendarView() {
    const { data: session, status } = useSession();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchEvents = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const res = await fetch("/api/calendar");
            if (res.ok) {
                const data = await res.json();
                setEvents(data.events || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") fetchEvents();
    }, [status, session]);

    if (status === "loading") {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">Connect Your Calendar</h2>
                    <p className="text-zinc-400">Sign in with Google to manage your schedule directly.</p>
                </div>
                <div className="w-64">
                    <GoogleCalendarConnect />
                </div>
            </div>
        );
    }

    // Helper: Get days of current week (Sun-Sat)
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Sunday
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);
    const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

    return (
        <div className="flex flex-col h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-white" />
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        <button className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="text-xs font-bold px-2 text-zinc-400 hover:text-white"
                        >
                            Today
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
                    <div className="w-48">
                        <GoogleCalendarConnect />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
                {/* Header Row */}
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/5 sticky top-0 bg-zinc-900 z-10">
                    <div className="p-4 border-r border-white/5"></div>
                    {weekDays.map((day, i) => (
                        <div key={i} className={`p-4 text-center border-r border-white/5 ${day.toDateString() === new Date().toDateString() ? 'bg-white/10' : ''}`}>
                            <p className="text-xs font-bold text-zinc-500 uppercase">{day.toLocaleString('default', { weekday: 'short' })}</p>
                            <p className={`text-lg font-bold mt-1 ${day.toDateString() === new Date().toDateString() ? 'text-white' : 'text-zinc-400'}`}>
                                {day.getDate()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Time Slots */}
                <div className="relative">
                    {/* Background Grid Lines */}
                    {timeSlots.map((hour) => (
                        <div key={hour} className="grid grid-cols-[60px_1fr] h-20 border-b border-white/5">
                            <div className="text-[10px] text-zinc-500 text-right pr-2 pt-2 border-r border-white/5 bg-zinc-950/30">
                                {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                            </div>
                            <div className="grid grid-cols-7 h-full">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="border-r border-white/5 h-full relative group hover:bg-white/[0.02] transition-colors">
                                        {/* Add Button Placeholder (visible on hover) */}
                                        <button className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Events Overlay */}
                    {events.map(event => {
                        const start = new Date(event.start.dateTime || event.start.date || "");
                        const end = new Date(event.end.dateTime || event.end.date || "");

                        // Simple filtering to this week view
                        const firstDayOfWeek = weekDays[0];
                        const lastDayOfWeek = weekDays[6];
                        if (start < firstDayOfWeek || start > lastDayOfWeek) return null;

                        const dayIndex = start.getDay(); // 0-6
                        const startHour = start.getHours();
                        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                        // Only show if within our 8am-6pm view for now
                        if (startHour < 8 || startHour > 18) return null;

                        const topOffset = (startHour - 8) * 80; // 80px per hour
                        const height = durationHours * 80;

                        return (
                            <div
                                key={event.id}
                                className="absolute z-10 p-1"
                                style={{
                                    top: `${topOffset}px`,
                                    left: `calc(60px + ${(100 / 7) * dayIndex}%)`,
                                    width: `calc((100% - 60px) / 7)`,
                                    height: `${height}px`
                                }}
                            >
                                <div className="w-full h-full bg-zinc-800 border-l-2 border-white rounded p-2 text-xs overflow-hidden hover:bg-zinc-700 transition-colors cursor-pointer">
                                    <p className="font-bold text-white truncate">{event.summary}</p>
                                    <p className="text-zinc-400 mt-1">
                                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
