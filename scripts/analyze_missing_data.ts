
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { console.error('Missing Creds'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

const MANUAL_MAPPING: Record<string, string> = {
    "cotedivoire": "Côte d'Ivoire",
    "burkinafaso": "Burkina Faso",
    "saudiarabia": "Saudi Arabia",
    "iranislamicrepublicof": "Iran",
    "sierraleone": "Sierra Leone",
    "southafrica": "South Africa",
    "hongkong": "Hong Kong",
    "papuanewguinea": "Papua New Guinea",
    "unitedstates": "United States",
    "unitedkingdom": "United Kingdom",
    "korea": "South Korea",
    "congo": "DR Congo",
    "tanzaniaunitedrepublicof": "Tanzania",
    "peru": "Peru",
    "chile": "Chile",
    "colombia": "Colombia",
    "mexico": "Mexico",
    "argentina": "Argentina",
    "bolivia": "Bolivia",
    "ecuador": "Ecuador",
    "canada": "Canada",
    "australia": "Australia",
    "brazil": "Brazil",
    "russia": "Russia",
    "india": "India",
    "china": "China",
    "indonesia": "Indonesia",
    "kazakhstan": "Kazakhstan",
    "mongolia": "Mongolia",
    "philippines": "Philippines",
    "poland": "Poland",
    "sweden": "Sweden",
    "turkey": "Turkey",
    "ukraine": "Ukraine",
    "uzbekistan": "Uzbekistan",
    "vietnam": "Vietnam",
    "zambia": "Zambia",
    "zimbabwe": "Zimbabwe",
    "ghana": "Ghana",
    "mali": "Mali",
    "guinea": "Guinea",
    "namibia": "Namibia",
    "botswana": "Botswana",
    "mauritania": "Mauritania",
    "morocco": "Morocco"
};

function normalize(str: string) {
    if (!str) return "";
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function analyze() {
    console.log("Fetching canonical countries...");
    const { data: countries } = await supabase.from('countries').select('name, display_name, code');
    if (!countries) throw new Error("Could not fetch countries");

    const countryMap = new Map<string, string>();
    countries.forEach(c => {
        countryMap.set(normalize(c.name), c.name);
        if (c.display_name) countryMap.set(normalize(c.display_name), c.name);
        if (c.code) countryMap.set(normalize(c.code), c.name);
    });

    const csvPath = path.join(process.cwd(), 'public', 'export-user27012026.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    let alreadyHasNationality = 0;
    let recoverableFromWork = 0;
    let recoverableFromMepr = 0;
    let recoverableFromLocation = 0;
    let stillMissing = 0;

    console.log(`Analyzing ${records.length} records...`);

    const samples: any[] = [];

    for (const record of records) {
        // Current Logic
        let rawNat = record['nationality'];
        let normNat = normalize(rawNat);
        let resolvedNat = countryMap.get(normNat) || MANUAL_MAPPING[normNat];

        if (resolvedNat) {
            alreadyHasNationality++;
            continue;
        }

        // Strategy 1: Check work_country
        let rawWork = record['work_country'];
        let normWork = normalize(rawWork);
        let resolvedWork = countryMap.get(normWork) || MANUAL_MAPPING[normWork];

        if (resolvedWork) {
            recoverableFromWork++;
            samples.push({ type: 'Work', original: rawWork, resolved: resolvedWork });
            continue;
        }

        // Strategy 2: Check mepr-address-country
        let rawMepr = record['mepr-address-country'];
        let normMepr = normalize(rawMepr);
        let resolvedMepr = countryMap.get(normMepr) || MANUAL_MAPPING[normMepr];

        if (resolvedMepr) {
            recoverableFromMepr++;
            samples.push({ type: 'Mepr', original: rawMepr, resolved: resolvedMepr });
            continue;
        }

        // Strategy 3: Check community-events-location
        let rawLoc = record['community-events-location'];
        let normLoc = normalize(rawLoc);
        let resolvedLoc = countryMap.get(normLoc) || MANUAL_MAPPING[normLoc];

        if (resolvedLoc) {
            recoverableFromLocation++;
            samples.push({ type: 'Location', original: rawLoc, resolved: resolvedLoc });
            continue;
        }

        stillMissing++;
    }

    const summary = `
--- Analysis Results ---
Total Records in CSV: ${records.length}
With Valid Nationality (Current - approx): ${alreadyHasNationality}
Recoverable from Work Country: +${recoverableFromWork}
Recoverable from MEPR Country: +${recoverableFromMepr}
Recoverable from Events Location: +${recoverableFromLocation}
Still Missing: ${stillMissing}
Potential Total Coverage: ${alreadyHasNationality + recoverableFromWork + recoverableFromMepr + recoverableFromLocation} (${((alreadyHasNationality + recoverableFromWork + recoverableFromMepr + recoverableFromLocation) / records.length * 100).toFixed(2)}%)
`;

    console.log(summary);
    fs.writeFileSync('analysis_summary.txt', summary);

    console.log("\n--- Sample Recoveries ---");
    samples.slice(0, 10).forEach(s => console.log(`[${s.type}] '${s.original}' -> ${s.resolved}`));
}

analyze();
