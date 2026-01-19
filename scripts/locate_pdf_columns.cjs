
const fs = require('fs');

const POSTS_CSV = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';

console.log(`Scanning ${POSTS_CSV} for PDF data...`);

const content = fs.readFileSync(POSTS_CSV, 'utf8');
const lines = content.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

// Find key column indexes
const pdfIdx = headers.findIndex(h => h === 'meta_pdf');
const titleIdx = headers.findIndex(h => h === 'title');

let hits = 0;

for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (!row) continue;

    // Condition 1: Row contains ".pdf" string
    if (row.toLowerCase().includes('.pdf')) {
        hits++;
        console.log(`\n[HIT] Row ${i} contains '.pdf'`);

        const cols = row.split(','); // Naive split

        // Print relevant cols
        if (titleIdx > -1) console.log(`   Title: ${cols[titleIdx]}`);
        if (pdfIdx > -1) console.log(`   meta_pdf: ${cols[pdfIdx]}`);

        // Scan ALL columns for the PDF string
        cols.forEach((val, idx) => {
            if (val.toLowerCase().includes('.pdf')) {
                console.log(`   Found in Column [${headers[idx]}]: ${val}`);
            }
        });

        if (hits > 5) break;
    }
}

if (hits === 0) console.log("❌ No '.pdf' found in any row.");
