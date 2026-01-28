import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("📥 Received Webhook Payload:", JSON.stringify(body, null, 2));

        // Normalize Data (Handling both flattened and nested formats)
        const rawLead = body.lead || body;
        const rawBusiness = body.business || body;

        const leadId = crypto.randomUUID();

        const newLead: any = {
            id: leadId,
            business_name: rawBusiness.name || rawBusiness.businessName || "Unknown Business",
            address: rawBusiness.address,
            website: rawBusiness.website,
            phone: rawBusiness.phone,
            email: rawBusiness.email,

            // Context
            industry: rawLead.industry || rawBusiness.category,
            pain_point: rawLead.painPoint,
            suggested_message: rawLead.suggestedMessage,

            // Process
            status: 'New',
            stage: 'New',
            last_action_at: new Date().toISOString(),

            // Backup
            raw_data: body
        };

        // If Supabase is configured, insert
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { error } = await supabase
                .from('leads')
                .insert(newLead);

            if (error) {
                console.error("Supabase Insert Error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        } else {
            console.log("⚠️ Supabase URL not set. Skipping DB insert.", newLead);
        }

        return NextResponse.json({ success: true, leadId: leadId });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ leads: data });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
