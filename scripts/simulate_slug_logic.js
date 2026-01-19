
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// 1. Setup Env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.PUBLIC_SUPABASE_URL, envConfig.PUBLIC_SUPABASE_ANON_KEY);

// 2. Mock Logic from [slug].astro
async function run() {
    console.log("🚀 STARTING SLUG LOGIC SIMULATION");

    // Get First Topic
    const { data: topic } = await supabase.from('topics').select('*').limit(1).single();
    if (!topic) { console.error("No topic"); return; }
    console.log(`Topic: ${topic.name}`);

    // Fetch IDs (Mimic Promise.all)
    // Posts
    const { data: posts } = await supabase.from('posts').select('id').eq('topic_id', topic.id);
    const postIds = posts?.map(p => p.id) || [];
    console.log(`Post IDs: ${postIds.length}`);

    // Events
    const { data: events } = await supabase.from('events').select('id').eq('topic_id', topic.id);
    const eventIds = events?.map(e => e.id) || [];
    console.log(`Event IDs: ${eventIds.length}`);

    // Fetch Content (Events)
    if (eventIds.length > 0) {
        const now = new Date().toISOString();
        const { data: eventItems, error } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds)
            .or(`end_date.gte.${now},start_date.gte.${now}`) // DATE FILTER
            .order('start_date', { ascending: true })
            .limit(100);

        if (error) console.error("Event Query Error:", error);

        console.log(`Filtered Event Items (Future): ${eventItems?.length || 0}`);

        if (eventItems && eventItems.length > 0) {
            console.log("Sample Event Type:", eventItems[0].event_type);
            // Logic Check
            const isWebinar = eventItems[0].event_type === 'webinar';
            console.log(`Is Webinar? ${isWebinar}`);
        } else {
            // Debug: check Unfiltered
            const { count } = await supabase.from('events').select('*', { count: 'exact', head: true }).in('id', eventIds);
            console.log(`Total Unfiltered Events in DB for this topic: ${count}`);
            console.log(`(If Total > 0 but Future == 0, then DATE FILTER is hiding them)`);
            console.log(`Current Server Time (ISO): ${now}`);
        }
    }

    // Fetch Content (Posts / PDFs)
    if (postIds.length > 0) {
        const { data: postItems } = await supabase
            .from('posts')
            .select('*, author:profiles(full_name)')
            .in('id', postIds)
            .limit(5);

        console.log(`Post Items: ${postItems?.length || 0}`);
        if (postItems?.length > 0) {
            const p = postItems[0];
            console.log(`Sample Post: ${p.title}`);
            console.log(`Document URL: ${p.document_url}`);

            if (p.document_url) {
                // Test Proxy Fetch?
                console.log("Checking Document URL availability...");
                // Assuming URL is full
                // If relative, we can't fetch.
                console.log(`URL seems to be: ${p.document_url.startsWith('http') ? 'Absolute' : 'Relative'}`);
            }
        }
    }
}

run();
