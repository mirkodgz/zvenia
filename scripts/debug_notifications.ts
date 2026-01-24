
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Fix path to .env.local: Go up one level from 'scripts' to root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Must function for audits

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('FATAL: Could not load env vars. Checked path:', path.join(__dirname, '..', '.env.local'));
    console.error('PUBLIC_SUPABASE_URL:', supabaseUrl ? 'FOUND' : 'MISSING');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'FOUND' : 'MISSING');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkNotifications() {
    console.log(`\n=== DEBUGGING NOTIFICATIONS (URL: ${supabaseUrl}) ===\n`);

    // 1. Check if table exists and has rows
    const { count, error: countError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("❌ Error accessing 'notifications' table:", countError.message);
    } else {
        console.log(`✅ Table 'notifications' exists. Total rows: ${count}`);
    }

    // 2. Fetch last 5 notifications
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
            console.table(notifications.map(n => ({
                id: n.id,
                type: n.type,
                target_user: n.user_id,
                actor: n.actor_id,
                title: n.title,
                created: new Date(n.created_at).toLocaleString()
            })));
        }
    }

    // 3. Check Social Likes to verify triggers should have fired
    const { data: likes } = await supabase
        .from('social_likes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    console.log("\nRecent Likes (Trigger Sources):");
    if (!likes || likes.length === 0) {
        console.log("   (No likes found)");
    } else {
        console.table(likes.map(l => ({
            id: l.id,
            user: l.user_id,
            content: l.content_id,
            type: l.content_type,
            created: new Date(l.created_at).toLocaleString()
        })));
    }
}

checkNotifications();
