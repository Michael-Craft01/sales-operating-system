import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
        return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }

    const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("lead_id", leadId)
        .order("date", { ascending: true });

    if (error) {
        console.error("Error fetching appointments:", error);
        // Return empty if table doesn't exist yet to prevent crash
        return NextResponse.json({ appointments: [] });
    }

    return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, title, date, type, status } = body;

        const { data, error } = await supabase
            .from("appointments")
            .insert({
                lead_id: leadId,
                title,
                date,
                type,
                status
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, appointment: data });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }
}
