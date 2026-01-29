import { NextResponse } from 'next/server';
import { generateOutreach } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, leadContext } = body;

        if (!leadId || !leadContext) {
            return NextResponse.json({ error: "Missing leadId or context" }, { status: 400 });
        }

        const message = await generateOutreach(leadContext);

        // Save to DB (Optional: update the lead with the new suggestion)
        await supabase
            .from('leads')
            .update({ suggested_message: message })
            .eq('id', leadId);

        return NextResponse.json({ message });

    } catch (error: any) {
        console.error("AI Endpoint Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to generate message",
            isConfigError: error.message.includes("GEMINI_API_KEY")
        }, { status: 500 });
    }
}
