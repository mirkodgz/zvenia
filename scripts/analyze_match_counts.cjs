
const fs = require('fs');
const readline = require('readline');

const USER_CSV = 'd:/zvenia/migration_data/user-export-1-6951d2e937896.csv';
const MEDIA_CSV = 'd:/zvenia/mediawordpress_converted.csv';

// Helper to handle CSV quotes loosely if needed, but since we are looking for IDs which are numbers, split might work ok for the key check
function parseLine(line) {
    return line.split(',');
}

async function main() {
    console.log('--- Migration Match Analysis ---');

    // 1. Load All Media IDs
    const mediaIds = new Set();
    const mediaStream = fs.createReadStream(MEDIA_CSV);
    const rlMedia = readline.createInterface({ input: mediaStream, crlfDelay: Infinity });

    let mCount = 0;
    for await (const line of rlMedia) {
        if (mCount === 0) { mCount++; continue; } // skip header
        const parts = parseLine(line);
        if (parts[0]) mediaIds.add(parts[0].trim());
        mCount++;
    }
    console.log(`Step 1: Loaded ${mediaIds.size} Media IDs from Library.`);

    // 2. Scan User Export
    const userStream = fs.createReadStream(USER_CSV);
    const rlUser = readline.createInterface({ input: userStream, crlfDelay: Infinity });

    let totalUsers = 0;
    let usersWithPicId = 0;
    let successfulMatches = 0;
    let failedMatches = 0;

    let idx = -1;

    for await (const line of rlUser) {
        if (totalUsers === 0) {
            const parts = parseLine(line);
            idx = parts.indexOf('profile-picture');
            console.log(`Profile Picture Column Index: ${idx}`);
            totalUsers++;
            continue;
        }

        const parts = parseLine(line);
        const picId = parts[idx];

        if (picId && picId.trim() !== '') {
            usersWithPicId++;
            if (mediaIds.has(picId.trim())) {
                successfulMatches++;
            } else {
                failedMatches++;
                if (failedMatches < 5) console.log(`Example Mismatch: User has ID [${picId}] but not found in Library.`);
            }
        }
        totalUsers++;
    }

    console.log('\n--- Final Stats ---');
    console.log(`Total Users in Export: ${totalUsers - 1}`);
    console.log(`Users declaring a Profile Picture ID: ${usersWithPicId}`);
    console.log(`Valid Matches (ID exists in Library): ${successfulMatches}`);
    console.log(`Invalid Matches (ID missing in Library): ${failedMatches}`);
    console.log(`Match Rate: ${((successfulMatches / usersWithPicId) * 100).toFixed(1)}%`);
}

main();
