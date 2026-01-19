
import fs from 'fs';
import readline from 'readline';

async function analyzeCsv() {
    const fileStream = fs.createReadStream('d:/zvenia/migration_data/user-export-1-6951d2e937896.csv');
    const outputFile = 'd:/zvenia/astro-frontend/scripts/csv_analysis_result.txt';

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let profilePicIndex = -1;
    let fotoDePerfilIndex = -1;
    let count = 0;

    // Clear previous results
    fs.writeFileSync(outputFile, '');

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
            profilePicIndex = header.indexOf('profile-picture');
            fotoDePerfilIndex = header.indexOf('foto-de-perfil');

            const headerInfo = `Index of 'profile-picture': ${profilePicIndex}\nIndex of 'foto-de-perfil': ${fotoDePerfilIndex}\n\n`;
            fs.appendFileSync(outputFile, headerInfo);
            continue;
        }

        if (count < 50) { // Check first 50 rows
            const pic1 = columns[profilePicIndex];
            const pic2 = columns[fotoDePerfilIndex];

            // Only print if there is data
            if (pic1 || pic2) {
                const msg = `Row ${count + 1}:\n` +
                    (pic1 ? `  profile-picture (${profilePicIndex}): ${pic1}\n` : '') +
                    (pic2 ? `  foto-de-perfil (${fotoDePerfilIndex}): ${pic2}\n` : '') +
                    '-------------------\n';
                fs.appendFileSync(outputFile, msg);
                count++;
            }
        } else {
            break;
        }
    }
}

analyzeCsv();
