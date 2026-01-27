
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
    console.log("--- Inspecting 'posts' table ---");
    const { data: post, error: err1 } = await supabase.from('posts').select('*').limit(1);

    if (err1) {
        console.error("Error posts:", err1.message);
        return;
    }

    if (post && post.length > 0) {
        console.log("Columns:", Object.keys(post[0]));
        // Check for topic_id or similar
        const topicCol = Object.keys(post[0]).find(k => k.includes('topic'));
        console.log(`Topic column found: ${topicCol}`);
    } else {
        console.log("Table 'posts' is empty.");
    }
}

inspect();
