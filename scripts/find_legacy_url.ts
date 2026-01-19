
import fs from 'fs';
import * as csv from 'fast-csv';

const TARGET_TITLE = "Specific surface area of polydispersions as a function of size distribution sharpness (2020)";
const CSV_PATH_POSTS = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const CSV_PATH_MEDIA = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function searchInCsv(filePath: string, label: string) {
    console.log(`Scanning ${label}...`);
    const targetKey = normalize(TARGET_TITLE);

    return new Promise((resolve) => {
        let found = false;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const title = row.title || row.post_title || '';
                const key = normalize(title);

                // Flexible match
                if (key.includes(targetKey) || targetKey.includes(key) && key.length > 50) {
                    console.log(`\n✅ FOUND in ${label}:`);
                    console.log(`Title: ${title}`);
                    console.log(`Link: ${row.link || 'N/A'}`);
                    console.log(`GUID: ${row.guid || 'N/A'}`);
                    console.log(`Media URL: ${row.wp_attachment_url || 'N/A'}`);
                    found = true;
                }
            })
            .on('end', () => {
                if (!found) console.log(`Not found in ${label}.`);
                resolve(true);
            });
    });
}

async function run() {
    await searchInCsv(CSV_PATH_POSTS, 'Posts CSV');
    await searchInCsv(CSV_PATH_MEDIA, 'Media CSV');
}

run();
