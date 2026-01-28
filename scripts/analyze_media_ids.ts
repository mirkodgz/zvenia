
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_FILE = 'public/export-user27012026.csv';
const XML_FILES = [
    'public/media-en2024-dic2025.xml',
    'public/media-en2025-en2026.xml'
];

function extractIdFromXml(content: string, id: string): string | null {
    // Simple regex for memory efficiency (XML parsing 20mb might be heavy if full DOM)
    // Looking for: <wp:post_id>26387</wp:post_id> ... <wp:attachment_url>...</wp:attachment_url>
    // Since XML is structured, we can regex specific IDs.

    // HOWEVER, the file is large. A line-by-line or simple string index search is better.
    // Let's try finding the ID, then finding the NEXT attachment_url.

    const idTag = `<wp:post_id>${id}</wp:post_id>`;
    const idIndex = content.indexOf(idTag);

    if (idIndex === -1) return null;

    // Search forward for valid URL or attachment_url
    // We look at the content chunk starting from the ID
    const chunk = content.slice(idIndex, idIndex + 5000); // 5kb lookahead should cover meta

    // Match <wp:attachment_url> OR <guid>
    const urlMatch = chunk.match(/<wp:attachment_url><!\[CDATA\[(.*?)\]\]><\/wp:attachment_url>/) ||
        chunk.match(/<wp:attachment_url>(.*?)<\/wp:attachment_url>/);

    if (urlMatch) {
        return urlMatch[1];
    }

    // Cloudinary backups in meta?
    const cloudMatch = chunk.match(/<wp:meta_value><!\[CDATA\[.*?"secure_url";s:\d+:"(.*?)";.*?\]\]><\/wp:meta_value>/);
    if (cloudMatch) {
        return cloudMatch[1];
    }

    return null;
}

// 2nd pass: Build a Look-Up Table from XMLs first (Memory is cheap enough for 20mb text)
// Actually, iterating XMLs once finding all IDs is better.

async function run() {
    console.log("🔍 Scanning CSV for numeric Media IDs...");
    const filePath = path.resolve(process.cwd(), CSV_FILE);
    if (!fs.existsSync(filePath)) {
        console.error("CSV Not Found");
        return;
    }

    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(csvContent, { columns: true, skip_empty_lines: true });

    const candidates: { email: string; name: string; mediaId: string }[] = [];

    // Columns known to store the picture: 'profile-picture' or sometimes implicit
    // In the previous task, we saw Zachariah at line 1639 with '26387' in column `profile-picture`

    for (const record of records as any[]) {
        // Try to find the probable column. Keys might differ.
        const pic = record['profile-picture'] || record['foto-de-perfil'];

        if (pic && /^\d+$/.test(pic)) {
            candidates.push({
                email: record.user_email || record.email,
                name: record.display_name || record.username,
                mediaId: pic
            });
        }
    }

    console.log(`📋 Found ${candidates.length} users with numeric Media IDs.`);

    if (candidates.length === 0) return;

    // Load XMLs
    console.log("📂 Loading XML Media Maps...");
    let xmlCombined = "";
    for (const xmlFile of XML_FILES) {
        const p = path.resolve(process.cwd(), xmlFile);
        if (fs.existsSync(p)) {
            xmlCombined += fs.readFileSync(p, 'utf-8');
        } else {
            console.warn(`⚠️ XML Missing: ${xmlFile}`);
        }
    }

    console.log("🔄 Resolving URLs...");
    const recovered: any[] = [];

    for (const c of candidates) {
        const url = extractIdFromXml(xmlCombined, c.mediaId);
        if (url) {
            recovered.push({ ...c, url });
            console.log(`✅ [${c.mediaId}] ${c.name} -> ${url.substring(0, 60)}...`);
        } else {
            console.log(`❌ [${c.mediaId}] ${c.name} -> Not found in XMLs`);
        }
    }

    console.log(`\n🎉 Summary: Recovered ${recovered.length} / ${candidates.length} photos.`);

    if (recovered.length > 0) {
        // Generate SQL or JSON for next step
        const jsonOut = path.resolve(process.cwd(), 'scripts/recovered_photos.json');
        fs.writeFileSync(jsonOut, JSON.stringify(recovered, null, 2));
        console.log(`💾 Saved recovery data to ${jsonOut}`);
    }
}

run();
