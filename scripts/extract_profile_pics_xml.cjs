
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File paths
const USER_EXPORT_CSV = 'd:/zvenia/migration_data/user-export-1-6951d2e937896.csv';
const MEDIA_XML = 'd:/zvenia/mediawordpress.xml';
const OUTPUT_MAPPING_CSV = 'd:/zvenia/migration_data/media_id_url_mapping.csv';
const OUTPUT_USER_URLS_CSV = 'd:/zvenia/migration_data/user_profile_urls.csv';

// CSV Parsing helper (simple split, handling quotes loosely for this specific task if needed, but standard split usually works for simple IDs)
// Better to use a robust splitter if possible, but let's assume standard CSV for now.
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    return values;
}

async function main() {
    console.log('Starting processing...');

    // 1. Read User Export to get needed Media IDs
    console.log('Reading User Export CSV...');
    const userMap = new Map(); // email -> media_id
    const neededMediaIds = new Set();

    // Check if files exist
    if (!fs.existsSync(USER_EXPORT_CSV)) {
        console.error(`Error: User export file not found at ${USER_EXPORT_CSV}`);
        return;
    }
    if (!fs.existsSync(MEDIA_XML)) {
        console.error(`Error: Media XML file not found at ${MEDIA_XML}`);
        return;
    }

    const userStream = fs.createReadStream(USER_EXPORT_CSV);
    const userRL = readline.createInterface({ input: userStream, crlfDelay: Infinity });

    let headers = null;
    let emailIdx = -1;
    let picIdx = -1;
    let altPicIdx = -1; // foto-de-perfil

    for await (const line of userRL) {
        if (!headers) {
            headers = parseCSVLine(line);
            emailIdx = headers.indexOf('user_email');
            picIdx = headers.indexOf('profile-picture');
            altPicIdx = headers.indexOf('foto-de-perfil');
            console.log(`Found headers: email at ${emailIdx}, profile-picture at ${picIdx}, foto-de-perfil at ${altPicIdx}`);
            continue;
        }

        const cols = parseCSVLine(line);
        const email = cols[emailIdx];
        let mediaId = cols[picIdx];

        // Fallback or check alternative
        if ((!mediaId || mediaId === '') && altPicIdx !== -1) {
            mediaId = cols[altPicIdx];
        }

        if (mediaId && mediaId.trim() !== '' && mediaId !== '0') {
            // Basic cleaner
            mediaId = mediaId.trim();
            userMap.set(email, mediaId);
            neededMediaIds.add(mediaId);
        }
    }
    console.log(`Found ${userMap.size} users with profile pictures.`);
    console.log(`Unique Media IDs to find: ${neededMediaIds.size}`);

    // 2. Scan XML for these IDs
    console.log('Scanning XML file...');
    const mediaIdToUrl = new Map();
    const xmlStream = fs.createReadStream(MEDIA_XML);
    const xmlRL = readline.createInterface({ input: xmlStream, crlfDelay: Infinity });

    let currentPostId = null;
    let inItem = false;
    let buffer = '';

    // Regex for extraction
    const postIdRegex = /<wp:post_id>(\d+)<\/wp:post_id>/;
    const urlRegex = /<wp:attachment_url>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/wp:attachment_url>/;
    // Alternative URL finding if attachment_url is missing or weird
    // const guidRegex = /<guid.*?>(.*?)<\/guid>/; 

    // We need to handle multi-line XML. 
    // State machine approach:
    // When <item> starts, reset state.
    // Capture post_id.
    // Capture attachment_url.
    // When </item> ends, if we have both and ID matches, save it.

    let capturedId = null;
    let capturedUrl = null;

    for await (const line of xmlRL) {
        const trimmed = line.trim();

        if (trimmed.includes('<item>')) {
            capturedId = null;
            capturedUrl = null;
        }

        const idMatch = trimmed.match(postIdRegex);
        if (idMatch) {
            capturedId = idMatch[1];
        }

        const urlMatch = trimmed.match(urlRegex);
        if (urlMatch) {
            capturedUrl = urlMatch[1];
        }

        if (trimmed.includes('</item>')) {
            if (capturedId && capturedUrl) {
                // We store ALL IDs found just in case, or filter?
                // Filtering speeds up if set is huge, but here set is small (few thousands max).
                // Let's store all match we find to be safe, or just needed ones.
                if (neededMediaIds.has(capturedId)) {
                    mediaIdToUrl.set(capturedId, capturedUrl);
                }
            }
            capturedId = null;
            capturedUrl = null;
        }
    }

    console.log(`Found URLs for ${mediaIdToUrl.size} / ${neededMediaIds.size} unique IDs.`);

    // 3. Write outputs
    console.log('Writing outputs...');

    // Mapping File
    const mappingStream = fs.createWriteStream(OUTPUT_MAPPING_CSV);
    mappingStream.write('media_id,url\n');
    for (const [id, url] of mediaIdToUrl) {
        mappingStream.write(`${id},"${url}"\n`);
    }
    mappingStream.end();

    // User File
    const userUrlStream = fs.createWriteStream(OUTPUT_USER_URLS_CSV);
    userUrlStream.write('user_email,media_id,url\n');
    let foundCount = 0;
    for (const [email, id] of userMap) {
        const url = mediaIdToUrl.get(id);
        if (url) {
            userUrlStream.write(`${email},${id},"${url}"\n`);
            foundCount++;
        } else {
            // Log missing?
            // userUrlStream.write(`${email},${id},NOT_FOUND\n`);
        }
    }
    userUrlStream.end();

    console.log(`Successfully mapped ${foundCount} users to URLs.`);
    console.log('Done.');
}

main().catch(err => console.error(err));
