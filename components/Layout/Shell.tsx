"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Database, MessageSquare, ChevronLeft, ChevronRight, Menu } from "lucide-react";
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

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed as requested

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Header */}
                <div className={cn("flex items-center border-b border-white/10", isCollapsed ? "p-4 justify-center" : "p-6")}>
                    {isCollapsed ? (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 bg-black rounded-full" />
                        </div>
                    ) : (
                        <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 bg-black rounded-full" />
                            </div>
                            <span className="whitespace-nowrap">SALES<span className="font-light opacity-50">OS</span></span>
                        </h1>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-full transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5",
                                    isCollapsed ? "justify-center" : ""
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-colors shrink-0",
                                        isActive ? "text-black" : "text-zinc-500 group-hover:text-white"
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="tracking-wide whitespace-nowrap opacity-100 transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Toggle */}
                <div className="p-4 border-t border-white/10 flex flex-col gap-4">
                    {!isCollapsed && (
                        <div className="text-[10px] uppercase tracking-widest text-zinc-600 text-center whitespace-nowrap">
                            System Active
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-center p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 overflow-y-auto h-screen w-full transition-all duration-300",
                    isCollapsed ? "ml-20" : "ml-64"
                )}
            >
                {children}
            </main>
        </div>
    );
}
