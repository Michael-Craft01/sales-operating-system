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
    { name: "Scraper", href: "/scraper", icon: Database },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    SALES<span className="font-light opacity-50">OS</span>
                </h1>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 group",
                                isActive
                                    ? "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-black" : "text-zinc-500 group-hover:text-white"
                                )}
                            />
                            <span className="tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 text-[10px] uppercase tracking-widest text-zinc-600 text-center">
                System Active
            </div>
        </aside>
    );
}
