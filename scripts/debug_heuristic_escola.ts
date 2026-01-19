
import fs from 'fs';
import * as csv from 'fast-csv';

const OLD_POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const TARGET_SLUG = 'escola-de-minas-da-universidade-federal-de-ouro-preto-o-desafio-de-educar-durante-seus-135-anos-2012';

async function debug() {
    console.log("🐛 DEBUGGING ESCOLA...");

    fs.createReadStream(OLD_POSTS_CSV)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row: any) => {
            const slug = row['wp_post_name'] || row['post_name'];

            if (slug === TARGET_SLUG) {
                console.log("   ✅ Slug Match Found!");
                const keys = Object.keys(row);
                for (const key of keys) {
                    const val = row[key];
                    if (val && val.length > 5 && val.toLowerCase().includes('.pdf')) {
                        console.log(`      Found candidate in [${key}]: ${val.substring(0, 100)}...`);

                        const cleanUrl = val.split('?')[0];
                        const trimmed = cleanUrl.replace(/[\n\r"']/g, '').trim();
                        const filename = trimmed.split('/').pop();

                        console.log(`      -> Extracted Filename: '${filename}'`);

                        if (filename.toLowerCase().endsWith('.pdf')) {
                            console.log("      -> Valid PDF Filename ✅");
                        } else {
                            console.log("      -> INVALID Filename (Doesn't end in .pdf) ❌");
                        }
                    }
                }
            }
        })
        .on('end', () => console.log("Done."));
}

debug();
