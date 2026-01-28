import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
    const demoLeads = [
        {
            business_name: "Apex Dental Studio",
            industry: "Healthcare",
            stage: "New",
            pain_point: "Missed calls",
            suggested_message: "We can automate your callbacks.",
            address: "123 Smile Rd"
        },
        {
            business_name: "TechFlow Systems",
            industry: "SaaS",
            stage: "Qualified",
            pain_point: "Slow deployment",
            suggested_message: "Deploy 10x faster with our CI/CD.",
            website: "techflow.io"
        },
        {
            business_name: "GreenGardens",
            industry: "Service",
            stage: "Contacted",
            pain_point: "Seasonality",
            address: "555 Oak Ave"
        },
        {
            business_name: "Urban Boutique",
            industry: "Retail",
            stage: "Engaged",
            pain_point: "Foot traffic",
            suggested_message: "Drive locals to your store with SMS.",
        }
    ];

    try {
        for (const lead of demoLeads) {
            await supabase.from('leads').insert(lead);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
    }
}
