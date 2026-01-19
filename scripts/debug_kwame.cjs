
const fs = require('fs');
const readline = require('readline');

const USER_CSV = 'd:/zvenia/migration_data/user-export-1-6951d2e937896.csv';
const MEDIA_CSV = 'd:/zvenia/mediawordpress_converted.csv';
const KWAME_EMAIL = 'kwameamponsahyeboah7@gmail.com';

async function main() {
    console.log(`Investigating user: ${KWAME_EMAIL}`);

    // 1. Get Kwame's Profile Picture ID
    const userStream = fs.createReadStream(USER_CSV);
    const rlUser = readline.createInterface({ input: userStream, crlfDelay: Infinity });

    let mediaId = null;
    let headers = null;
    let picIndex = -1;

    for await (const line of rlUser) {
        const parts = line.split(','); // Check if simple split works or if we need quote parsing

        if (!headers) {
            headers = parts;
            picIndex = headers.indexOf('profile-picture');
            continue;
        }

        // CSV might be messy, but let's try strict email match
        if (line.includes(KWAME_EMAIL)) {
            // We'll trust the index found previously (33) if simple split is risky
            // But let's try to grab it using the verified index from previous steps: 33
            // Assuming strict column alignment
            const rawParts = line.split(',');
            if (picIndex !== -1 && rawParts[picIndex]) {
                mediaId = rawParts[picIndex];
                console.log(`Found Kwame in User Export.`);
                console.log(`Line raw (truncated): ${line.substring(0, 100)}...`);
                console.log(`Media ID (Index ${picIndex}): ${mediaId}`);
            } else {
                // Fallback: Check index 33 explicitly
                mediaId = rawParts[33];
                console.log(`Found Kwame (using fallback Index 33). Media ID: ${mediaId}`);
            }
            break;
        }
    }

    if (!mediaId) {
        console.error('Could not find Kwame or his Media ID in user export.');
        return;
    }

    // 2. Check Valid Media ID in Media CSV
    console.log(`Looking up Media ID: ${mediaId} in Media CSV...`);
    const mediaStream = fs.createReadStream(MEDIA_CSV);
    const rlMedia = readline.createInterface({ input: mediaStream, crlfDelay: Infinity });

    let foundMedia = false;
    for await (const line of rlMedia) {
        if (line.startsWith(`${mediaId},`)) { // Simple prefix match for CSV ID
            console.log(`MATCH FOUND in Media CSV:`);
            console.log(line);
            foundMedia = true;
            break;
        }
    }

    if (!foundMedia) {
        console.log(`❌ Media ID ${mediaId} matches NOTHING in mediawordpress_converted.csv`);
        console.log(`This confirms why he was skipped: The ID in his profile does not exist in the media library export.`);
    }
}

main();
