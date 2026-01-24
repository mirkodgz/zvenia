import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

function splitFullName(fullName: string | null): { firstName: string; lastName: string } {
    if (!fullName || fullName.trim() === '') {
        return { firstName: '', lastName: '' };
    }

    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/).filter(p => p.length > 0);

    if (parts.length === 0) {
        return { firstName: '', lastName: '' };
    }

    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    return { firstName, lastName };
}

async function fixUsersWithFullnameButNoNames() {
    console.log('🚀 Buscando usuarios con full_name pero sin first_name o last_name...\n');

    let page = 0;
    const pageSize = 1000;
    let totalProcessed = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    while (true) {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name, full_name')
            .not('full_name', 'is', null)
            .or('first_name.is.null,last_name.is.null,first_name.eq.,last_name.eq.')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('❌ Error obteniendo perfiles:', error);
            break;
        }

        if (!profiles || profiles.length === 0) {
            break;
        }

        console.log(`📋 Procesando ${profiles.length} usuarios...`);

        for (const profile of profiles) {
            totalProcessed++;

            if (!profile.full_name || profile.full_name.trim() === '') {
                skipped++;
                continue;
            }

            const { firstName, lastName } = splitFullName(profile.full_name);

            // Solo actualizar si el first_name o last_name están vacíos
            const needsUpdate = (!profile.first_name || profile.first_name.trim() === '') ||
                               (!profile.last_name || profile.last_name.trim() === '');

            if (needsUpdate && firstName) {
                try {
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({
                            first_name: firstName,
                            last_name: lastName || null
                        })
                        .eq('id', profile.id);

                    if (updateError) {
                        errors++;
                        if (errors <= 10) {
                            console.error(`   ❌ Error actualizando ${profile.email}: ${updateError.message}`);
                        }
                    } else {
                        updated++;
                        if (updated % 50 === 0) {
                            process.stdout.write(`   ✅ ${updated} usuarios actualizados...\r`);
                        }
                    }
                } catch (e: any) {
                    errors++;
                    if (errors <= 10) {
                        console.error(`   ❌ Excepción actualizando ${profile.email}: ${e.message}`);
                    }
                }
            } else {
                skipped++;
            }
        }

        if (profiles.length < pageSize) {
            break;
        }

        page++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('📊 RESUMEN');
    console.log('='.repeat(60));
    console.log(`✅ Usuarios actualizados: ${updated}`);
    console.log(`⏭️  Omitidos: ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📋 Total procesados: ${totalProcessed}`);
    console.log('='.repeat(60));
    console.log('\n🎉 Proceso completado!');
}

fixUsersWithFullnameButNoNames().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});

