
import fs from 'fs';
import readline from 'readline';

async function scanForUrls() {
    const fileStream = fs.createReadStream('d:/zvenia/migration_data/user-export-1-6951d2e937896.csv');
    const outputFile = 'd:/zvenia/astro-frontend/scripts/csv_url_scan.txt';

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let count = 0;

    fs.writeFileSync(outputFile, '--- Scanning for Image URLs ---\n');

    for await (const line of rl) {
        let columns = [];
        let current = '';
        let inQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                columns.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        columns.push(current);
        columns = columns.map(c => c.replace(/^"|"$/g, ''));

        if (!header) {
            header = columns;
            continue;
        }

        if (count < 100) {
            columns.forEach((col, index) => {
                if (col.includes('http') && (col.includes('.jpg') || col.includes('.png') || col.includes('.jpeg') || col.includes('.webp'))) {
                    const colName = header[index] || `Index ${index}`;
                    fs.appendFileSync(outputFile, `Row ${count + 1} - Column '${colName}': ${col}\n`);
                }
            });
            count++;
        } else {
            break;
        }
    }

    if (count === 0) {
        fs.appendFileSync(outputFile, 'No rows scanned.\n');
    }
}

scanForUrls();
