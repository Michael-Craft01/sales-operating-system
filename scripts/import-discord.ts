import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// CONFIGURATION
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const rawChannelId = process.env.DISCORD_CHANNEL_ID || "";
const CHANNEL_ID = rawChannelId.replace(/[^0-9]/g, "");
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
    console.log(`🔍 Found ${messages.length} messages. Processing Spidey Bot Embeds...`);

    let count = 0;

    for (const msg of messages) {
        let data: any = {};
        let found = false;

        // STRATEGY: Parse Embed Fields (Spidey Bot Format)
        if (msg.embeds && msg.embeds.length > 0) {
            const embed = msg.embeds[0];
            if (embed.fields) {

                data.raw_data = embed; // Store entire embed as raw backup

                for (const field of embed.fields) {
                    const name = field.name.toLowerCase();
                    const value = field.value;

                    // Debug: Log what we see to catch mismatches
                    // console.log(`   ? Field: ${name} = ${value.substring(0, 20)}...`);

                    if (name.includes("business")) {
                        data.business_name = value.replace(/\*\*/g, "").trim();
                        found = true;
                    } else if (name.includes("location") || name.includes("address")) {
                        data.address = value;
                    } else if (name.includes("industry")) {
                        data.industry = value;
                    } else if (name.includes("pain point")) {
                        data.pain_point = value;
                    } else if (name.includes("website")) {
                        data.website = value;
                    } else if (name.includes("phone")) {
                        data.phone = value;
                    } else if (name.includes("email")) {
                        data.email = value;
                    } else if (name.includes("whatsapp")) {
                        // Extract URL if markdown [Click](url)
                        const urlMatch = value.match(/\((.*?)\)/);
                        if (urlMatch) data.website = urlMatch[1];
                    }
                }

                // Extract Proposed Message from Second Embed if available
                if (msg.embeds[1] && msg.embeds[1].description && msg.embeds[1].description.includes("Suggested Attack Plan")) {
                    const desc = msg.embeds[1].description;
                    const codeBlockMatch = desc.match(/```([\s\S]*?)```/);
                    if (codeBlockMatch) {
                        data.suggested_message = codeBlockMatch[1].trim();
                    }
                }
            }
        }

        // fallback to old JSON parsing if no embed fields found
        if (!found && msg.content) {
            const jsonMatch = msg.content.match(/({[\s\S]*})/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[1]);
                    data = { ...data, ...parsed };
                    data.business_name = parsed.business?.name || parsed.businessName || parsed.business_name;
                    found = !!data.business_name;
                } catch (e) { }
            }
        }

        if (found && data.business_name) {
            const newLead = {
                business_name: data.business_name,
                address: data.address,
                website: data.website,
                phone: data.phone,
                email: data.email,
                industry: data.industry,
                pain_point: data.pain_point,
                suggested_message: data.suggested_message,
                stage: 'New',
                raw_data: msg // Store full message object as backup
            };

            const { error } = await supabase.from('leads').insert(newLead);
            if (!error) {
                count++;
                console.log(`   + Imported: ${newLead.business_name}`);
            } else {
                // CRITICAL: Log the error if it fails
                console.error(`   - Failed to insert ${newLead.business_name}:`, error.message, error.details);
            }
        }
    }

    console.log(`✅ Import Complete. Imported ${count} leads.`);
}

importDiscordLeads();
