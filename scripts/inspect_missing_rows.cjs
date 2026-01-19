
const fs = require('fs');

const CSV_FILE = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';

console.log(`Inspecting ${CSV_FILE}...`);

const content = fs.readFileSync(CSV_FILE, 'utf8');
const lines = content.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

// Indices
const slugIdx = headers.indexOf('wp_post_name');
const thumbIdx = headers.indexOf('meta__thumbnail_id');
const pdfIdx = headers.indexOf('meta_pdf-text-url');

console.log(`Indices: slug=${slugIdx}, thumb=${thumbIdx}, pdf=${pdfIdx}`);

let count = 0;
for (let i = 1; i < lines.length && count < 5; i++) {
    const row = lines[i];
    const cols = row.split(','); // Naive split (warning: commas in quotes might break this, but good enough for quick peek)

    const slug = cols[slugIdx] ? cols[slugIdx].replace(/^"|"$/g, '').trim() : '';
    const thumb = cols[thumbIdx] ? cols[thumbIdx].replace(/^"|"$/g, '').trim() : '';
    const pdf = cols[pdfIdx] ? cols[pdfIdx].replace(/^"|"$/g, '').trim() : '';

    // If "Missing" (no thumb, no pdf, has slug)
    if (slug.length > 2 && (!thumb || thumb === '0') && (!pdf || pdf === 'true')) {
        console.log(`\n[MISSING] Slug: ${slug}`);
        console.log(`   (No Thumb, No PDF)`);
        console.log(`   Potential Hidden Data:`);

        cols.forEach((val, idx) => {
            const cleanVal = val.replace(/^"|"$/g, '').trim();
            // Show only interesting cols
            if (cleanVal.length > 3 && cleanVal !== 'true' && cleanVal !== 'false' && !cleanVal.startsWith('0000')) {
                // Ignore standard WP fields to reduce noise
                if (!headers[idx].startsWith('wp_') && !headers[idx].includes('date') && !headers[idx].includes('status')) {
                    console.log(`      ${headers[idx]}: ${cleanVal}`);
                }
            }
        });
        count++;
    }
}
