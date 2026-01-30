import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using the key provided in env

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing Direct Insert with Key ending in:', supabaseKey.slice(-10));

    const payload = {
        business_name: "Direct Insert Test " + Date.now(),
        status: 'New',
        stage: 'New'
    };

    const { data, error } = await supabase
        .from('leads')
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error('❌ Insert Failed:', error);
    } else {
        console.log('✅ Insert Successful:', data);
    }
}

testInsert();
