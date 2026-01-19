
const fs = require('fs');
// const csv = require('fast-csv'); // Avoid dep if possible, but manual split is flaky. Let's try manual first.

const content = fs.readFileSync('d:/zvenia/migration_data/datos nuevos/z-post-limpio.csv', 'utf8');
const lines = content.split('\n');
const headers = lines[0].split(',');

// Normalize headers (strip quotes)
const cleanHeaders = headers.map(h => h.replace(/^"|"$/g, '').trim());

// Find interesting columns
const pdfIdx = cleanHeaders.findIndex(h => h === 'meta_pdf');
const dlIdx = cleanHeaders.findIndex(h => h === 'meta_download_link');
const fileIdx = cleanHeaders.findIndex(h => h === 'meta_file'); // Often used by ACF
const linkIdx = cleanHeaders.findIndex(h => h === 'meta_pdf-link-admin');

console.log('Indexes:', { pdfIdx, dlIdx, fileIdx, linkIdx });

let count = 0;
for (let i = 1; i < lines.length && count < 15; i++) {
    const cols = lines[i].split(','); // Naive split

    // Helper to get safe val
    const getVal = (idx) => (idx > -1 && cols[idx]) ? cols[idx].replace(/^"|"$/g, '').trim() : '';

    const pdfVal = getVal(pdfIdx);
    const dlVal = getVal(dlIdx);
    const fileVal = getVal(fileIdx);
    const linkVal = getVal(linkIdx);

    // Only log if something interesting exists (not empty, not "true" boolean trash)
    if (
        (pdfVal && pdfVal.length > 2 && pdfVal !== 'true') ||
        (dlVal && dlVal.length > 2) ||
        (fileVal && fileVal.length > 2) ||
        (linkVal && linkVal.length > 2)
    ) {
        console.log(`[Row ${i}] PDF: "${pdfVal}" | DL: "${dlVal}" | Link: "${linkVal}"`);
        count++;
    }
}
