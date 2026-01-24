
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('FATAL: Could not load env vars.');
    console.log('Path checked:', path.join(__dirname, '..', '.env.local'));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkNotifications() {
    console.log(`\n=== DEBUGGING NOTIFICATIONS (JS) ===\n`);

    const { count, error: countError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("❌ Error accessing 'notifications' table:", countError.message);
    } else {
        console.log(`✅ Table 'notifications' exists. Total rows: ${count}`);
    }

    const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("❌ Error fetching rows:", error);
    } else {
        console.log("\nRecent Notifications:");
        if (!notifications || notifications.length === 0) {
            console.log("   (No notifications found)");
        } else {
            console.table(notifications);
        }
    }
}

checkNotifications();
