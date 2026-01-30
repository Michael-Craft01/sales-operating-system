import { ClosingZone } from "@/components/leads/ClosingZone";

export default async function ClosingPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return (
        <div className="w-full p-4 md:p-12 flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            <div className="text-center space-y-4 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">The Moment of Truth</h2>
                <p className="text-zinc-400 text-lg">
                    Has the deal been secured? Update the status to proceed.
                </p>
            </div>

            <div className="w-full">
                <ClosingZone leadId={params.id} />
            </div>
        </div>
    );
}
