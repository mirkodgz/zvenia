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
        // Solo un nombre, usarlo como first_name
        return { firstName: parts[0], lastName: '' };
    }

    // Primer nombre como first_name, el resto como last_name
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    return { firstName, lastName };
}

async function updateAllFirstLastNames() {
    console.log('🚀 Iniciando actualización masiva de first_name y last_name...\n');

    let page = 0;
    const pageSize = 1000;
    let totalProcessed = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: Array<{ email: string; error: string }> = [];

    while (true) {
        console.log(`📋 Obteniendo página ${page + 1}...`);
        
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name, full_name')
            .or('first_name.is.null,last_name.is.null,first_name.eq.,last_name.eq.')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('❌ Error obteniendo perfiles:', error);
            break;
        }

        if (!profiles || profiles.length === 0) {
            break;
        }

        console.log(`   Encontrados ${profiles.length} usuarios sin first_name o last_name\n`);

        for (const profile of profiles) {
            totalProcessed++;

            // Solo actualizar si no tiene first_name o last_name, pero sí tiene full_name
            if ((!profile.first_name || profile.first_name.trim() === '') && 
                (!profile.last_name || profile.last_name.trim() === '') && 
                profile.full_name && profile.full_name.trim() !== '') {
                
                const { firstName, lastName } = splitFullName(profile.full_name);

                if (firstName) {
                    try {
                        const { data: updatedProfile, error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                first_name: firstName,
                                last_name: lastName || null
                            })
                            .eq('id', profile.id)
                            .select('id, email, first_name, last_name')
                            .single();

                        if (updateError) {
                            errors++;
                            errorDetails.push({ email: profile.email || 'unknown', error: updateError.message });
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
                        errorDetails.push({ email: profile.email || 'unknown', error: e.message || 'Unknown error' });
                        if (errors <= 10) {
                            console.error(`   ❌ Excepción actualizando ${profile.email}: ${e.message}`);
                        }
                    }
                } else {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        if (profiles.length < pageSize) {
            break;
        }

        page++;
        
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('📊 RESUMEN DE ACTUALIZACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Usuarios actualizados exitosamente: ${updated}`);
    console.log(`⏭️  Usuarios omitidos: ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📋 Total procesados: ${totalProcessed}`);
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

updateAllFirstLastNames().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});

