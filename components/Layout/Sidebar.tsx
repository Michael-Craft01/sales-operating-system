"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Database, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-20 h-screen bg-black border-r border-white/10 flex flex-col items-center py-8 fixed left-0 top-0 z-50 transition-all duration-300">
            {/* Logo Icon */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <div className="w-3 h-3 bg-black rounded-full" />
            </div>

            <nav className="flex-1 space-y-6 w-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                            )}
                            title={item.name}
                        >
                            <item.icon
                                className={cn(
                                    "w-6 h-6 transition-transform group-hover:scale-110",
                                    isActive && "text-white"
                                )}
                            />
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Vertical Name */}
            <div className="mt-auto mb-12 flex flex-col items-center justify-center gap-4">
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
                <h2 className="writing-vertical-rl text-zinc-400 font-serif italic text-lg tracking-widest opacity-60 hover:opacity-100 transition-opacity rotate-180 cursor-default whitespace-nowrap">
                    Michael Ragu
                </h2>
            </div>
        </aside>
    );
}
