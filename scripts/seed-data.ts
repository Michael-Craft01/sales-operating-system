import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STAGES = ['New', 'Qualified', 'Contacted', 'Engaged', 'Scheduled', 'ClosedWon', 'ClosedLost'];
const INDUSTRIES = ['Tech', 'Healthcare', 'Finance', 'Retail', 'Education'];

function randomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedData() {
    console.log('🌱 Seeding Database...');

    // 1. Clear existing data (optional, maybe dangerous? keeping it additive for now, or just deleting test data)
    // await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 

    const leads = [];

    for (let i = 0; i < 20; i++) {
        const stage = randomElement(STAGES);
        const created = randomDate(new Date(2025, 0, 1), new Date());

        leads.push({
            business_name: `Seeded Corp ${i + 1} - ${randomElement(['Inc', 'Ltd', 'Solutions', 'Co'])}`,
            industry: randomElement(INDUSTRIES),
            stage: stage,
            status: stage === 'ClosedWon' || stage === 'ClosedLost' ? 'Archived' : 'Active',
            created_at: created.toISOString(),
            last_action_at: randomDate(created, new Date()).toISOString(),
            email: `contact@corp${i}.com`,
            pain_point: "Needs better CRM",
            suggested_message: "We can help you grow."
        });
    }

    const { error } = await supabase.from('leads').insert(leads);

    if (error) {
        console.error('❌ Seeding failed:', error);
    } else {
        console.log('✅ Successfully seeded 20 leads!');
    }
}

seedData();
