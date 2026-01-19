
const fs = require('fs');
const readline = require('readline');

const INPUT_CSV = 'd:/zvenia/migration_data/user-export-1-6951d2e937896.csv';

async function main() {
    const fileStream = fs.createReadStream(INPUT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let headers = [];
    let profilePicIndex = -1;
    let fotoPerfilIndex = -1;
    let emailIndex = -1;

    for await (const line of rl) {
        // Simple comma split (assuming no commas in headers for these fields currently, which seems true)
        const parts = line.split(',');

        if (headers.length === 0) {
            headers = parts;
            profilePicIndex = headers.indexOf('profile-picture');
            fotoPerfilIndex = headers.indexOf('foto-de-perfil');
            emailIndex = headers.indexOf('user_email');

            console.log(`Indexes found:`);
            console.log(` - user_email: ${emailIndex}`);
            console.log(` - profile-picture: ${profilePicIndex}`);
            console.log(` - foto-de-perfil: ${fotoPerfilIndex}`);
            continue;
        }

        if (parts[emailIndex] === 'benittawiafe@gmail.com') {
            console.log('\n--- Found Benitta ---');
            console.log(`Email: ${parts[emailIndex]}`);
            console.log(`profile-picture (Index ${profilePicIndex}): ${parts[profilePicIndex]}`);
            console.log(`foto-de-perfil (Index ${fotoPerfilIndex}): ${parts[fotoPerfilIndex]}`);
            break;
        }
    }
}

main();
