
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPublishedAt() {
    console.log('🔍 Checking published_at column...\n');

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, created_at, published_at')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('⚠️ No posts found');
        return;
    }

    console.log(`✅ Found ${posts.length} posts. Comparing dates:\n`);
    posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Created:   ${post.created_at}`);
        console.log(`   Published: ${post.published_at || 'NULL'}`);
        console.log('');
    });
}

checkPublishedAt().catch(console.error);
