import { NextResponse } from 'next/server';
import { generateSalesDoc, DocType } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadContext, docType } = body;

        if (!leadContext) {
            return NextResponse.json({ error: "Missing context" }, { status: 400 });
        }

        const document = await generateSalesDoc(leadContext, docType || 'proposal');
        return NextResponse.json({ document });

    } catch (error: any) {
        console.error("AI Doc Endpoint Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to generate document"
        }, { status: 500 });
    }
}
