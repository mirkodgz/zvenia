
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPostDates() {
    console.log('🔍 Checking Post Dates...\n');
    let output = '';

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, created_at, metadata')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        output += `❌ Error fetching posts: ${error.message}\n`;
        console.error('❌ Error fetching posts:', error);
    } else if (!posts || posts.length === 0) {
        output += '⚠️ No posts found\n';
    } else {
        output += `✅ Found ${posts.length} recent posts:\n`;
        posts.forEach((post, index) => {
            output += `${index + 1}. ${post.title}\n`;
            output += `   ID: ${post.id}\n`;
            output += `   Created: ${post.created_at} (${new Date(post.created_at).toDateString()})\n`;
            if (post.metadata?.date) {
                output += `   Metadata Date: ${post.metadata.date}\n`;
            }
            if (post.metadata?.wordpress_date) {
                output += `   WP Date: ${post.metadata.wordpress_date}\n`;
            }
            output += '\n';
        });
    }

    fs.writeFileSync('debug_output.txt', output);
    console.log('Done writing to debug_output.txt');
}

checkPostDates().catch(console.error);
