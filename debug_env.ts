
import dotenv from 'dotenv';
dotenv.config();
console.log('Keys:', Object.keys(process.env).filter(k => !k.startsWith('Program') && !k.startsWith('System') && !k.startsWith('WIN')));
