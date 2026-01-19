
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_TITLE = "Permisología Minera (57 Pages)";
// Convert View URL to Direct Download URL
const NEW_URL = "https://drive.google.com/uc?export=download&id=1BcYZ-ADeeRDkFIy0D9HlhBUKIHNwl_2m";

async function run() {
    console.log(`🚀 Updating PDF Link for: "${TARGET_TITLE}"`);
    console.log(`🔗 New URL: ${NEW_URL}`);

    // 1. Find the post
    const { data: posts, error: searchError } = await supabase
        .from('posts')
        .select('id, title, document_url')
        .ilike('title', `%${TARGET_TITLE.substring(0, 20)}%`);

    if (searchError) {
        console.error("❌ Search Error:", searchError);
        return;
    }

    // Exactish match filter (or just take the best match if fuzzy search worked)
    // We'll relax it to just check if one was found, or check against TARGET_TITLE parts
    const post = posts?.find(p => p.title.toLowerCase().includes(TARGET_TITLE.toLowerCase().substring(0, 10)));

    if (!post) {
        console.error("❌ Post not found in DB.");
        return;
    }

    console.log(`✅ Found Post ID: ${post.id}`);
    console.log(`   Current URL: ${post.document_url}`);

    // 2. Update
    const { error: updateError } = await supabase
        .from('posts')
        .update({ document_url: NEW_URL })
        .eq('id', post.id);

    if (updateError) {
        console.error("❌ Update Failed:", updateError);
    } else {
        console.log("✅ Database Updated Successfully!");
    }
}

run();
