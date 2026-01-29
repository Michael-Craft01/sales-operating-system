import { createClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
// Native fetch is available in Node 18+

// CONFIGURATION
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; // "Bot YOUR_TOKEN"
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function importDiscordLeads() {
    if (!DISCORD_TOKEN || !CHANNEL_ID) {
        console.error("❌ Missing DISCORD_TOKEN or DISCORD_CHANNEL_ID");
        return;
    }

    console.log(`📡 Fetching messages from channel ${CHANNEL_ID}...`);

    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=100`, {
        headers: {
            Authorization: `Bot ${DISCORD_TOKEN}`
        }
    });

    if (!response.ok) {
        console.error("❌ Failed to fetch Discord messages:", await response.text());
        return;
    }

    const messages: any[] = await response.json();
    console.log(`🔍 Found ${messages.length} messages. Processing...`);

    let count = 0;

    for (const msg of messages) {
        // Attempt to find JSON in the message content
        const match = msg.content.match(/```json\n([\s\S]*?)\n```/) || msg.content.match(/{[\s\S]*}/);

        if (match) {
            try {
                const jsonStr = match[1] || match[0];
                const data = JSON.parse(jsonStr);

                // Transform to Lead (Recycling the logic from API)
                const businessName = data.business?.name || data.businessName || data.business_name;
                if (!businessName) continue;

                const newLead = {
                    business_name: businessName,
                    address: data.business?.address || data.address,
                    website: data.business?.website || data.website,
                    phone: data.business?.phone || data.phone,
                    email: data.business?.email || data.email,
                    industry: data.industry || data.business?.category,
                    stage: 'New',
                    raw_data: data
                };

                const { error } = await supabase.from('leads').insert(newLead);
                if (!error) count++;
                else console.error(`⚠️ Failed to insert ${businessName}:`, error.message);

            } catch (e) {
                console.log(`⚠️ Skipping message ${msg.id}: Not valid JSON`);
            }
        }
    }

    console.log(`✅ Import Complete. Imported ${count} leads.`);
}

importDiscordLeads();
