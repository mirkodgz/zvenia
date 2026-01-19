
const fs = require('fs');

const POSTS_CSV = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const content = fs.readFileSync(POSTS_CSV, 'utf8');
const lines = content.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

// Columns to check
const colsToCheck = ['meta_pdf', 'meta_pdf-link-admin', 'meta_pdf-text-url', 'meta_upload_file', 'meta_file'];
const colIndices = colsToCheck.map(name => ({ name, index: headers.findIndex(h => h === name) }));

console.log('Column Indices:', colIndices);

let hits = 0;
for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const cols = row.split(','); // Naive

    // Check if any of our target columns have data
    let hasData = false;
    let logMsg = `Row ${i}:\n`;

    colIndices.forEach(({ name, index }) => {
        if (index > -1) {
            const val = cols[index] ? cols[index].replace(/^"|"$/g, '').trim() : '';
            if (val && val !== 'true' && val !== 'false' && val.length > 1) {
                logMsg += `   ${name}: ${val}\n`;
                hasData = true;
            }
        }
    });

    if (hasData) {
        console.log(logMsg);
        hits++;
        if (hits > 10) break;
    }
}
