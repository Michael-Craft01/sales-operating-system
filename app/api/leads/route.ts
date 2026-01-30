import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Schema for Validation
const LeadSchema = z.object({
    lead: z.object({
        industry: z.string().optional(),
        painPoint: z.string().optional(),
        suggestedMessage: z.string().optional(),
    }).optional(),
    business: z.object({
        name: z.string().min(1, "Business name is required"),
        address: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.string().length(0)), // Allow empty string or valid email
        category: z.string().optional(),
    }).optional(),
    // Flattened fallback
    businessName: z.string().optional(),
    industry: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("📥 [Ingestion] Received Payload:", JSON.stringify(body, null, 2));

        // 1. Validate Input
        const parseResult = LeadSchema.safeParse(body);

        if (!parseResult.success) {
            console.error("❌ [Ingestion] Validation Error:", parseResult.error.format());
            return NextResponse.json({ error: "Validation Failed", details: parseResult.error.format() }, { status: 400 });
        }

        const { data } = parseResult;

        // 2. Normalize Data
        // Handle nested 'business' object OR flattened fields
        const businessName = data.business?.name || data.businessName || body.business_name;

        if (!businessName) {
            return NextResponse.json({ error: "Missing Business Name" }, { status: 400 });
        }

        const rawLead = body.lead || {};
        const rawBusiness = data.business || {};

        const newLead = {
            business_name: businessName,
            address: rawBusiness.address || body.address,
            website: rawBusiness.website || body.website,
            phone: rawBusiness.phone || body.phone,
            email: rawBusiness.email || body.email,

            // Context
            industry: data.industry || rawLead.industry || rawBusiness.category || body.industry,
            pain_point: rawLead.painPoint || body.pain_point,
            suggested_message: rawLead.suggestedMessage || body.suggested_message,

            // Process
            status: 'New',
            stage: 'New',
            last_action_at: new Date().toISOString(),

            // Backup
            raw_data: body
        };

        console.log("🛠️ [Ingestion] Processed Lead:", newLead.business_name);

        // 3. Database Insertion
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { data: inserted, error } = await supabase
                .from('leads')
                .insert(newLead)
                .select()
                .single();

            if (error) {
                console.error("🔥 [Ingestion] Supabase Error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            console.log("✅ [Ingestion] Successfully Saved:", inserted.id);
            return NextResponse.json({ success: true, lead: inserted });

        } else {
            console.error("⚠️ [Ingestion] Supabase not configured. Persistence failed.");
            return NextResponse.json({ error: "Database not configured" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("💥 [Ingestion] Critical Failure:", error);
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ leads: data });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
