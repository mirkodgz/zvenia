
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { Parser } = require('json2csv');

const XML_FILE = 'd:/zvenia/migration_data/datos nuevos/media-limpio.xml';
const CSV_FILE = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

async function convert() {
    console.log(`Reading XML: ${XML_FILE}`);
    const data = fs.readFileSync(XML_FILE, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);

    const items = result.rss.channel[0].item || [];
    console.log(`Found ${items.length} items. Flattening ALL fields...`);

    const simplifiedItems = items.map(item => {
        const row = {};

        // 1. Flatten Top Level (Standard Fields)
        for (const key in item) {
            if (key === 'wp:postmeta') continue;
            if (Array.isArray(item[key]) && item[key].length > 0) {
                // Clean up key names (remove colons for CSV compatibility sometimes helps)
                const cleanKey = key.replace(':', '_');
                let val = item[key][0];

                // If object (like attributes), stringify
                if (typeof val === 'object') val = JSON.stringify(val);

                // Limit content size to avoid CSV explosion if Excel is goal
                // Excel limit is 32767 chars per cell
                if (cleanKey === 'content_encoded' && val.length > 32000) val = val.substring(0, 32000) + '...[TRUNC]';

                row[cleanKey] = val;
            }
        }

        // 2. Flatten ALL Metas
        const metas = item['wp:postmeta'] || [];
        metas.forEach(meta => {
            if (meta['wp:meta_key'] && meta['wp:meta_value']) {
                const key = meta['wp:meta_key'][0];
                const val = meta['wp:meta_value'][0];

                // Prefix to avoid collision
                row[`meta_${key}`] = val;
            }
        });

        return row;
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(simplifiedItems);

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`✅ CSV Saved to: ${CSV_FILE}`);
}

convert().catch(console.error);
