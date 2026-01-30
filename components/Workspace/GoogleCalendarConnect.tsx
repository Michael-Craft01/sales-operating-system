"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, CheckCircle, Calendar } from "lucide-react";

export function GoogleCalendarConnect() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="flex items-center justify-between p-4 bg-zinc-900 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Google Calendar Connected</h4>
                        <p className="text-xs text-zinc-400">Synced as {session.user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                    <LogOut className="w-3 h-3" />
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
        >
            <Calendar className="w-5 h-5" />
            Connect Google Calendar
        </button>
    );
}
