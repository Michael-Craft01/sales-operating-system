"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sidebar } from "./Sidebar";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground w-full">
            <Sidebar />
            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 overflow-y-auto h-screen w-full transition-all duration-300 p-6",
                    "ml-64"
                )}
            >
                {children}
            </main>
        </div>
    );
}
