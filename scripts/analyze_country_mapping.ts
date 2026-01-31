
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Paths
const csvPath = path.join(process.cwd(), 'public', 'export-user27012026.csv');
const countriesPath = path.join(process.cwd(), 'scripts', 'canonical_countries.json');

// Normalization Helper
function normalize(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function analyzeMapping() {
    console.log("Loading datasets...");

    // Load Canonical Countries
    const canonicalCountries = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));
    // Map for quick lookup: normalized_name -> canonical_name
    const countryMap = new Map<string, string>();

    canonicalCountries.forEach((c: any) => {
        countryMap.set(normalize(c.name), c.name);
        if (c.display_name) countryMap.set(normalize(c.display_name), c.name);
        if (c.code) countryMap.set(normalize(c.code), c.name);
    });

    // Load CSV
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const analysis = {
        total_with_data: 0,
        direct_matches: 0,
        unmatched: 0,
        unmatched_values: {} as Record<string, number>,
        matched_examples: [] as string[]
    };

    records.forEach((record: any) => {
        const raw = record['nationality'];
        if (!raw || raw.trim() === '' || raw.trim() === 'NULL') return;

        analysis.total_with_data++;
        const norm = normalize(raw);

        if (countryMap.has(norm)) {
            analysis.direct_matches++;
            if (analysis.matched_examples.length < 5) {
                analysis.matched_examples.push(`${raw} -> ${countryMap.get(norm)}`);
            }
        } else {
            analysis.unmatched++;
            analysis.unmatched_values[raw] = (analysis.unmatched_values[raw] || 0) + 1;
        }
    });

    console.log("\n--- MAPPING ANALYSIS ---");
    console.log(`Total Records with Nationality: ${analysis.total_with_data}`);
    console.log(`Direct Matches (Auto-Mapped): ${analysis.direct_matches}`);
    console.log(`Unmatched Values: ${analysis.unmatched}`);
    console.log(`% Auto-Match: ${((analysis.direct_matches / analysis.total_with_data) * 100).toFixed(2)}%`);

    console.log("\n--- UNMATCHED VALUES TO RESOLVE (Top 20) ---");
    Object.entries(analysis.unmatched_values)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .forEach(([val, count]) => {
            console.log(`${val}: ${count}`);
        });

    console.log("\n--- MATCHED EXAMPLES ---");
    analysis.matched_examples.forEach(ex => console.log(ex));
}

analyzeMapping();
