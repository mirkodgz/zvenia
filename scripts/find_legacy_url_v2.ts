
import fs from 'fs';
import * as csv from 'fast-csv';

const TARGET_TITLE = "Specific surface area of polydispersions as a function of size distribution sharpness (2020)";
const CSV_PATH_POSTS = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';

function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z]/g, ''); // strict simple match
}

async function run() {
    const targetKey = normalize(TARGET_TITLE); // specificsurfaceareaofpolydispersionsasafunctionofsizedistributionsharpness

    fs.createReadStream(CSV_PATH_POSTS)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row: any) => {
            const title = row.title || row.post_title || '';
            const key = normalize(title);

            if (key.includes(targetKey.substring(0, 30))) { // Match first 30 chars
                console.log("\n--------------------------------------------------");
                console.log(`TITLE: ${title}`);
                console.log(`LINK: ${row.link}`);
                console.log(`GUID: ${row.guid}`);
                console.log("--------------------------------------------------\n");
            }
        });
}

run();
