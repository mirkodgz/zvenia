
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Define path to CSV
const csvPath = path.join(process.cwd(), 'public', 'export-user27012026.csv');

async function simulateMigration() {
    try {
        console.log(`Reading CSV from: ${csvPath}`);
        const fileContent = fs.readFileSync(csvPath, 'utf-8');

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(`Total rows in CSV: ${records.length}`);

        let countWithNationality = 0;
        let countWithoutNationality = 0;
        const nationalityValues: Record<string, number> = {};

        records.forEach((record: any) => {
            // "nationality" is the column confirmed by user
            const rawNat = record['nationality'];

            if (rawNat && rawNat.trim() !== '' && rawNat.trim() !== 'NULL') {
                countWithNationality++;
                const val = rawNat.trim();
                nationalityValues[val] = (nationalityValues[val] || 0) + 1;
            } else {
                countWithoutNationality++;
            }
        });

        console.log('\n--- SIMULATION RESULTS ---');
        console.log(`Users with 'nationality' data: ${countWithNationality}`);
        console.log(`Users MISSING 'nationality': ${countWithoutNationality}`);
        console.log(`Coverage Potential: ${((countWithNationality / records.length) * 100).toFixed(2)}%`);

        console.log('\nTop 20 Nationality Values Found:');
        Object.entries(nationalityValues)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .forEach(([val, num]) => console.log(`${val}: ${num}`));

    } catch (error) {
        console.error("Error reading CSV:", error);
    }
}

simulateMigration();
