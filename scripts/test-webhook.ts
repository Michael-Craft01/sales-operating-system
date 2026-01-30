import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local for DB verification
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWebhook() {
    const webhookUrl = 'http://localhost:3000/api/leads';
    console.log(`🚀 Testing Webhook: ${webhookUrl}`);

    const payload = {
        business: {
            name: "Test Corp " + Date.now(),
            email: "contact@testcorp.com",
            website: "https://testcorp.com",
            category: "Software"
        },
        lead: {
            painPoint: "Inefficient sales process",
            suggestedMessage: "We can help you scale."
        }
    };

    try {
        // 1. Send POST request
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Webhook failed with status ${response.status}: ${errorText}`);
            return;
        }

        const result = await response.json();
        console.log('✅ Webhook response:', result);

        if (result.success && result.lead?.id) {
            // 2. Verify in Database
            console.log(`🔎 Verifying lead ${result.lead.id} in database...`);
            const { data: dbLead, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', result.lead.id)
                .single();

            if (error) {
                console.error('❌ Database verification failed:', error.message);
            } else if (dbLead) {
                console.log('✅ Lead found in database!');
                console.log('   Business:', dbLead.business_name);
                console.log('   Stage:', dbLead.stage);
            } else {
                console.error('❌ Lead not found in database (silent failure?)');
            }
        }

    } catch (error: any) {
        console.error('💥 Test execution failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Verify that `npm run dev` is running on port 3000.');
        }
    }
}

testWebhook();
