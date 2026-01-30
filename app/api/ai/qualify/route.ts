import { generateQualificationQuestions } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { lead } = await request.json();

        if (!lead) {
            return NextResponse.json({ error: "Lead context required" }, { status: 400 });
        }

        const questions = await generateQualificationQuestions({
            businessName: lead.business_name,
            industry: lead.industry,
            painPoint: lead.pain_point
        });

        return NextResponse.json({ questions });

    } catch (error: any) {
        console.error("Qualification API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
