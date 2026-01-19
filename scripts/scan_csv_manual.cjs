
const fs = require('fs');
const readline = require('readline');

const CSV_PATH = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

async function scan() {
    const fileStream = fs.createReadStream(CSV_PATH);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineCount = 0;
    for await (const line of rl) {
        lineCount++;
        if (line.toLowerCase().includes('explosive')) {
            console.log(`[LINE ${lineCount}] FOUND: ${line}`);
            // Check manual splitting
            const parts = line.split(',');
            console.log(`[PARTS] Count: ${parts.length}`);
            console.log(`[PART 3] (Likely URL): ${parts[2]}`);
        }
    }
}

scan();
