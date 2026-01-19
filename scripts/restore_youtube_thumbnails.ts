
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const LEGACY_POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';

function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

async function restoreVideos() {
    console.log("🎥 RESTORING VIDEO THUMBNAILS...");

    let updated = 0;

    fs.createReadStream(LEGACY_POSTS_CSV)
        .pipe(csv.parse({ headers: true }))
        .on('data', async (row: any) => {
            const slug = row['wp_post_name'] || row['post_name'];
            const videoUrl = row['meta_external-video'];

            if (slug && videoUrl && videoUrl.length > 5) {
                // Check if YouTube
                const ytId = getYoutubeId(videoUrl);

                if (ytId) {
                    const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

                    // Update DB
                    const { data: posts } = await supabase
                        .from('posts')
                        .select('id, featured_image_url')
                        .eq('slug', slug);

                    if (posts && posts.length > 0) {
                        const p = posts[0];
                        // Update if missing or broken
                        if (!p.featured_image_url || p.featured_image_url.includes('zvenia.com')) {
                            const { error } = await supabase
                                .from('posts')
                                .update({ featured_image_url: thumbUrl })
                                .eq('id', p.id);

                            if (!error) {
                                console.log(`   ✅ [YOUTUBE] ${slug} -> Thumbnail Restored`);
                                updated++;
                            }
                        }
                    }
                }
            }
        })
        .on('end', () => {
            // wait slightly for async db ops
            setTimeout(() => {
                console.log(`\n🎉 VIDEO RESTORE COMPLETE. Updated: ${updated}`);
            }, 5000);
        });
}

restoreVideos().catch(console.error);
