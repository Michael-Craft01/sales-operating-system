export default function ClosingPage() {
    return (
        <div className="w-full p-4 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">05. Closing Sale</h2>
                <p>Contract and Signing tools coming soon.</p>
                <div className="flex gap-4 justify-center mt-6">
                    <button className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-xl font-bold transition-all">
                        Mark as WON
                    </button>
                    <button className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl font-bold transition-all">
                        Mark as LOST
                    </button>
                </div>
            </div>
        </div>
    )
}
