import { analyzeLeadPotential } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { lead } = await request.json();

        // Robustness: Allow missing pain_point by using a fallback
        const SafePainPoint = lead?.pain_point || "General Revenue Growth";

        if (!lead || !lead.business_name) {
            return NextResponse.json({ error: "Minimal lead context (business_name) required" }, { status: 400 });
        }

        const rawAnalysis = await analyzeLeadPotential({
            businessName: lead.business_name,
            industry: lead.industry || "Unknown",
            painPoint: SafePainPoint
        });

        // Parse JSON if Gemini returns it as a string
        let analysis;
        try {
            analysis = JSON.parse(rawAnalysis);
        } catch (e) {
            // Fallback: If JSON is malformed (e.g. bad newlines), try to clean it
            const cleaned = rawAnalysis
                .replace(/\n/g, "\\n")  // Escape real newlines
                .replace(/\r/g, "")      // Remove carriage returns
                .replace(/\t/g, "\\t");  // Escape tabs

            try {
                analysis = JSON.parse(cleaned);
            } catch (e2) {
                console.error("Cleaned Parse Failed. Returning raw text as fallback.");
                // LAST RESORT: Return a constructed object with raw text to prevent 500 Error
                analysis = {
                    budget_estimate: "$1,500 USD (Est.)",
                    tech_stack: ["Next.js", "Supabase", "AI Integration"],
                    dev_translation: "Analysis partially failed. Using fallback estimation. (Code: 501)"
                };
            }
        }

        console.log("Analysis parsed successfully or recovered.");

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error("Analysis API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
