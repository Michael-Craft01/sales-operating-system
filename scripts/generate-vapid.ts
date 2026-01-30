import webpush from 'web-push';

const vapidKeys = webpush.generateVAPIDKeys();

console.log('Paste these keys into your .env.local file:');
console.log('---------------------------------------------------');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"`);
console.log(`VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"`);
console.log('---------------------------------------------------');
console.log('Also ensure you have: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
