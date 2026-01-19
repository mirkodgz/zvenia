
const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('d:/zvenia/migration_data/datos nuevos/z-post-limpio.csv');

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

(async function () {
    for await (const line of rl) {
        if (line.includes('Specific surface area')) {
            console.log('--- FOUND LINE ---');
            console.log(line.substring(0, 1000)); // Print first 1000 chars of line
            console.log('--- END LINE ---');
        }
    }
})();
