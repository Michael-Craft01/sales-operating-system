import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNotification() {
    console.log('Testing Notifications Table...');

    const { data, error } = await supabase
        .from('notifications')
        .insert({
            type: 'info',
            title: 'System Verification',
            message: 'Database connection confirmed. Notification system is active.',
            link: null,
            is_read: false
        })
        .select()
        .single();

    if (error) {
        console.error('FAILED:', error.message);
        if (error.code === '42P01') {
            console.log('\n--> SUGGESTION: The "notifications" table does not exist.');
            console.log('    Please run the SQL in verify_notifications_table.ts or scripts/add_notifications_table.sql');
        }
    } else {
        console.log('SUCCESS: Notification inserted:', data);
    }
}

testNotification();
