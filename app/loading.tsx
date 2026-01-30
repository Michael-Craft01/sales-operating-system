export default function Loading() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white z-50">
            <div className="space-y-6 text-center">
                <div className="relative">
                    <h1 className="text-4xl md:text-6xl font-serif italic tracking-tighter text-white">
                        Michael Ragu
                    </h1>
                    <div className="absolute -inset-4 bg-white/5 blur-xl rounded-full opacity-0 animate-pulse" />
                </div>

                <div className="flex flex-col items-center gap-3">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />

                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-bounce" />
                    </div>

                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-mono mt-2">
                        Operating System
                    </p>
                </div>
            </div>
        </div>
    );
}
