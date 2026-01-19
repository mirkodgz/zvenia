
import fs from 'fs';
import * as csv from 'fast-csv';

const POSTS_CSV = 'd:/zvenia/migration_data/z-posts-full.csv';
const TARGET_TITLE = 'Escola de Minas';

async function traceAllCols() {
    console.log(`🕵️ DEEP INSPECT: "${TARGET_TITLE}"`);

    await new Promise((resolve) => {
        fs.createReadStream(POSTS_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                if (JSON.stringify(row).includes(TARGET_TITLE)) {
                    console.log(`   ✅ Found Post!`);
                    Object.keys(row).forEach(key => {
                        const val = row[key];
                        if (val && val.length > 2 && val !== '0') {
                            console.log(`      [${key}]: ${val.substring(0, 500)}`);
                        }
                    });
                }
            })
            .on('end', resolve);
    });
}

traceAllCols().catch(console.error);
