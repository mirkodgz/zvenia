
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.PUBLIC_SUPABASE_URL, envConfig.PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log("🔍 DIAGNOSING TOPIC DATA...");

    // 1. Fetch a Topic
    const { data: topic, error: topicErr } = await supabase
        .from('topics')
        .select('*')
        .limit(1)
        .single();

    if (topicErr) {
        console.error("❌ Failed to fetch ANY topic:", topicErr.message);
        return;
    }

    if (!topic) {
        console.error("⚠️ No topics found in DB.");
        return;
    }

    console.log(`✅ Found Topic: [${topic.name}] (ID: ${topic.id})`);

    // 2. Fetch Linked Posts
    const { data: posts, error: postErr } = await supabase
        .from('posts')
        .select('id, title, author:profiles(email)')
        .eq('topic_id', topic.id)
        .limit(5);

    if (postErr) {
        console.error("❌ Failed to fetch Posts for topic:", postErr.message);
    } else {
        console.log(`✅ found ${posts.length} posts for this topic.`);
        if (posts.length > 0) {
            console.log("   Sample Post:", posts[0].title);
            console.log("   Author Data:", posts[0].author); // Check if relation works
        }
    }

    // 3. Fetch Linked Events
    const { data: events, error: eventErr } = await supabase
        .from('events')
        .select('*')
        .eq('topic_id', topic.id)
        .limit(1);

    if (eventErr) {
        console.error("❌ Failed to fetch Events for topic:", eventErr.message);
    } else {
        console.log(`✅ found ${events.length} events for this topic.`);
        if (events.length > 0) {
            console.log("   FULL EVENT OBJECT:", JSON.stringify(events[0], null, 2));
            console.log("EVENT KEYS:", Object.keys(events[0]));
            console.log("EVENT TYPE VAL:", events[0].event_type);
        }
    }
}

run();
