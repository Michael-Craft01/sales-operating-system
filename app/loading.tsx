import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="text-zinc-500 text-sm animate-pulse tracking-widest uppercase font-mono">
                Loading System Resources...
            </p>
        </div>
    );
}
