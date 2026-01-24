import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

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

// Función para escapar valores CSV
function escapeCSV(value: any): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Función para convertir array/objeto a string
function formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join('; ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

async function exportUsersToCSV() {
    console.log('📊 Exportando usuarios a CSV...');
    console.log('');

    // Obtener todos los usuarios con paginación
    let allProfiles: any[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('❌ Error obteniendo usuarios:', error);
            return;
        }

        if (!data || data.length === 0) {
            hasMore = false;
        } else {
            allProfiles = allProfiles.concat(data);
            console.log(`   📥 Obtenidos ${allProfiles.length} usuarios...`);
            
            if (data.length < pageSize) {
                hasMore = false;
            } else {
                page++;
            }
        }
    }

    console.log(`✅ Total usuarios obtenidos: ${allProfiles.length}`);
    console.log('');

    if (allProfiles.length === 0) {
        console.log('⚠️ No hay usuarios para exportar');
        return;
    }

    // Obtener todos los campos posibles (de metadata también)
    const allMetadataKeys = new Set<string>();
    allProfiles.forEach(profile => {
        const metadata = (profile.metadata as any) || {};
        Object.keys(metadata).forEach(key => allMetadataKeys.add(key));
    });

    // Definir columnas
    const baseColumns = [
        'id',
        'email',
        'username',
        'role',
        'first_name',
        'last_name',
        'full_name',
        'avatar_url',
        'phone_number',
        'nationality',
        'profession',
        'work_country',
        'current_location',
        'headline_user',
        'main_language',
        'main_area_of_expertise',
        'company',
        'position',
        'linkedin_url',
        'profile_slug',
        'created_at',
        'updated_at'
    ];

    // Agregar columnas de metadata
    const metadataColumns = Array.from(allMetadataKeys).sort();
    const allColumns = [...baseColumns, ...metadataColumns.map(key => `metadata_${key}`)];

    // Generar CSV
    console.log('📝 Generando CSV...');
    let csvContent = allColumns.map(escapeCSV).join(',') + '\n';

    allProfiles.forEach(profile => {
        const row: string[] = [];

        // Campos base
        baseColumns.forEach(col => {
            let value = profile[col];
            if (col === 'metadata') {
                // metadata se maneja por separado
                value = '';
            }
            row.push(escapeCSV(formatValue(value)));
        });

        // Campos de metadata
        const metadata = (profile.metadata as any) || {};
        metadataColumns.forEach(key => {
            const value = metadata[key];
            row.push(escapeCSV(formatValue(value)));
        });

        csvContent += row.join(',') + '\n';
    });

    // Guardar archivo
    const fileName = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = path.resolve(process.cwd(), 'public', fileName);

    // Asegurar que la carpeta public existe
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(filePath, csvContent, 'utf-8');

    console.log('✅ CSV generado exitosamente!');
    console.log('');
    console.log('📁 Archivo guardado en:');
    console.log(`   ${filePath}`);
    console.log('');
    console.log('🌐 URL para descargar:');
    console.log(`   http://localhost:4321/${fileName}`);
    console.log('');
    console.log('📊 Estadísticas:');
    console.log(`   Total usuarios: ${allProfiles.length}`);
    console.log(`   Columnas: ${allColumns.length}`);
    console.log(`   - Campos base: ${baseColumns.length}`);
    console.log(`   - Campos metadata: ${metadataColumns.length}`);
    console.log('');
    console.log('💡 Puedes abrir el archivo en Excel, Google Sheets, etc.');
}

exportUsersToCSV();

