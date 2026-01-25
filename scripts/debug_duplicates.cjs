const https = require('https');

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const QUERY_TITLE = "Critical Minerals"; // Broader search
const ENCODED_TITLE = encodeURIComponent(`*${QUERY_TITLE}*`);

// Minimal select to avoid column errors
const url = `${SUPABASE_URL}/rest/v1/posts?title=ilike.${ENCODED_TITLE}&select=id,title,slug,created_at`;

const options = {
    headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
    }
};

console.log(`Searching for duplicates...`);

https.get(url, options, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
                console.error("Supabase Error:", parsed);
            } else {
                console.log("Count:", parsed.length);
                parsed.forEach(p => console.log(`- [${p.id}] ${p.created_at} | ${p.slug}`));
            }
        } catch (e) {
            console.log("Raw:", data);
        }
    });
});
