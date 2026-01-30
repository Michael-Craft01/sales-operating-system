import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
    console.error("No key found");
    process.exit(1);
}

const parts = key.split('.');
if (parts.length !== 3) {
    console.error("Invalid JWT format");
    process.exit(1);
}

const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
const parsed = JSON.parse(payload);

console.log("Key Role:", parsed.role);
console.log("Key Iss:", parsed.iss);
// Do not log the full key
