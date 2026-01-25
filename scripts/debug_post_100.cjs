const https = require('https');

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";

const POST_ID = "1aeeca59-ccd8-49ce-bd8b-ca997216f989";

const url = `${SUPABASE_URL}/rest/v1/posts?id=eq.${POST_ID}&select=*`;

const options = {
    headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
    }
};

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed, null, 2));

            if (parsed && parsed.length > 0) {
                const post = parsed[0];
                console.log("\n--- ANALYSIS ---");
                console.log("featured_image_url:", post.featured_image_url);
                console.log("document_url:", post.document_url);
                console.log("metadata:", JSON.stringify(post.metadata));
            } else {
                console.log("No post found with that ID.");
            }

        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.log("Raw Response:", data);
        }
    });

}).on('error', (err) => {
    console.error("Error fetching data:", err);
});
