import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const CSV_PATH = path.resolve(process.cwd(), 'public/users_complete_2026-01-22.csv');

// Función para parsear CSV considerando comillas y comas dentro de campos
function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Agregar el último valor
    values.push(current.trim());
    
    return values;
}

async function updateAllPositions() {
    console.log('🚀 Iniciando actualización masiva de campos position...\n');
    
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`❌ Archivo CSV no encontrado: ${CSV_PATH}`);
        process.exit(1);
    }

    const fileStream = fs.createReadStream(CSV_PATH);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let headers: string[] = [];
    let isHeader = true;
    let totalProcessed = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: Array<{ email: string; error: string }> = [];

    console.log('📋 Leyendo CSV y actualizando usuarios...\n');

    for await (const line of rl) {
        if (isHeader) {
            headers = parseCSVLine(line);
            isHeader = false;
            continue;
        }

        const cols = parseCSVLine(line);
        
        if (cols.length < headers.length) {
            continue; // Saltar líneas incompletas
        }

        // Mapear columnas a headers
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = cols[index] || '';
        });

        const email = row['email']?.trim();
        const position = row['position']?.trim();

        // Solo procesar si hay email y position tiene valor
        if (!email) {
            skipped++;
            continue;
        }

        if (!position || position === '') {
            skipped++;
            continue;
        }

        totalProcessed++;

        // Actualizar en Supabase
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ position: position })
                .eq('email', email)
                .select('id, email, position')
                .single();

            if (error) {
                // Si no se encuentra el usuario, no es un error crítico
                if (error.code === 'PGRST116') {
                    skipped++;
                } else {
                    errors++;
                    errorDetails.push({ email, error: error.message });
                    if (errors <= 10) {
                        console.error(`   ❌ Error actualizando ${email}: ${error.message}`);
                    }
                }
            } else if (data) {
                updated++;
                if (updated % 50 === 0) {
                    process.stdout.write(`   ✅ ${updated} usuarios actualizados...\r`);
                }
            }
        } catch (e: any) {
            errors++;
            errorDetails.push({ email, error: e.message || 'Unknown error' });
            if (errors <= 10) {
                console.error(`   ❌ Excepción actualizando ${email}: ${e.message}`);
            }
        }

        // Pequeña pausa para no sobrecargar la API
        if (totalProcessed % 100 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('📊 RESUMEN DE ACTUALIZACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Usuarios actualizados exitosamente: ${updated}`);
    console.log(`⏭️  Usuarios omitidos (sin position o no encontrados): ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📋 Total procesados del CSV: ${totalProcessed}`);
    console.log('='.repeat(60));

    if (errorDetails.length > 0 && errorDetails.length <= 20) {
        console.log('\n📝 Detalles de errores:');
        errorDetails.forEach(err => {
            console.log(`   - ${err.email}: ${err.error}`);
        });
    } else if (errorDetails.length > 20) {
        console.log(`\n⚠️  Hay ${errorDetails.length} errores. Mostrando los primeros 10:`);
        errorDetails.slice(0, 10).forEach(err => {
            console.log(`   - ${err.email}: ${err.error}`);
        });
    }

    console.log('\n🎉 Proceso completado!');
}

updateAllPositions().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});

