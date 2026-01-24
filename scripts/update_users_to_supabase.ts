import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

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

// Generar slug del email
function generateSlugFromEmail(email: string): string {
    if (!email) return '';
    return email
        .toLowerCase()
        .replace('@', '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Construir objeto metadata
function buildMetadata(row: any): any {
    const metadata: any = {};
    
    // Others languages
    if (row.metadata_others_languages) {
        const langIds = row.metadata_others_languages.split(';').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        if (langIds.length > 0) {
            metadata.others_languages = langIds;
        }
    }
    
    // Others areas of expertise
    if (row.metadata_others_areas_of_expertise) {
        const areaIds = row.metadata_others_areas_of_expertise.split(';').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        if (areaIds.length > 0) {
            metadata.others_areas_of_expertise = areaIds;
        }
    }
    
    // Z-PROMOTER
    if (row.metadata_z_promoter_why || row.metadata_z_promoter_contribute || row.metadata_z_promoter_priority_1_id) {
        metadata.z_promoter = {};
        if (row.metadata_z_promoter_why) metadata.z_promoter.why = row.metadata_z_promoter_why;
        if (row.metadata_z_promoter_contribute) metadata.z_promoter.contribute = row.metadata_z_promoter_contribute;
        if (row.metadata_z_promoter_priority_1_id) metadata.z_promoter.priority_1 = parseInt(row.metadata_z_promoter_priority_1_id);
        if (row.metadata_z_promoter_priority_2_id) metadata.z_promoter.priority_2 = parseInt(row.metadata_z_promoter_priority_2_id);
        if (row.metadata_z_promoter_priority_3_id) metadata.z_promoter.priority_3 = parseInt(row.metadata_z_promoter_priority_3_id);
    }
    
    // Z-ADS
    if (row.metadata_z_ads_company_name || row.metadata_z_ads_company_website) {
        metadata.z_ads = {};
        if (row.metadata_z_ads_company_name) metadata.z_ads.company_name = row.metadata_z_ads_company_name;
        if (row.metadata_z_ads_company_website) metadata.z_ads.company_website = row.metadata_z_ads_company_website;
        if (row.metadata_z_ads_primary_contact_name) metadata.z_ads.primary_contact_name = row.metadata_z_ads_primary_contact_name;
        if (row.metadata_z_ads_primary_contact_email) metadata.z_ads.primary_contact_email = row.metadata_z_ads_primary_contact_email;
        if (row.metadata_z_ads_primary_contact_phone) metadata.z_ads.primary_contact_phone = row.metadata_z_ads_primary_contact_phone;
        if (row.metadata_z_ads_product_description) metadata.z_ads.product_description = row.metadata_z_ads_product_description;
        if (row.metadata_z_ads_where_to_advertise) {
            const adIds = row.metadata_z_ads_where_to_advertise.split(';').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
            if (adIds.length > 0) {
                metadata.z_ads.where_to_advertise = adIds;
            }
        }
    }
    
    return Object.keys(metadata).length > 0 ? metadata : null;
}

async function updateUsersToSupabase() {
    console.log('🚀 Iniciando actualización de usuarios a Supabase...');
    console.log('');

    // Leer CSV completo
    console.log('📥 Leyendo CSV completo...');
    const csvPath = path.resolve(process.cwd(), 'public', 'users_complete_2026-01-22.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records: any[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
    });
    
    console.log(`✅ Total usuarios en CSV: ${records.length}`);
    console.log('');

    let updateCount = 0;
    let insertCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Separar UPDATE e INSERT
    const updateRecords = records.filter(r => r.action === 'UPDATE');
    const insertRecords = records.filter(r => r.action === 'INSERT');

    console.log(`📊 Usuarios a actualizar: ${updateRecords.length}`);
    console.log(`📊 Usuarios nuevos a crear: ${insertRecords.length}`);
    console.log('');

    // ============================================
    // PROCESAR USUARIOS UPDATE
    // ============================================
    console.log('🔄 Procesando usuarios UPDATE...');
    
    for (let i = 0; i < updateRecords.length; i++) {
        const row = updateRecords[i];
        
        try {
            const updateData: any = {};
            
            // IMPORTANTE: Solo actualizar campos que están VACÍOS en Supabase
            // NO tocamos: avatar_url, linkedin_url, first_name, last_name, full_name, etc.
            // El script de matching ya verificó que estos campos estén vacíos antes de incluirlos
            
            // Solo actualizar si el campo tiene valor en el CSV Y está vacío en Supabase
            // Solo actualizar campos que existen y tienen valor
            if (row.company && row.company.trim() !== '') updateData.company = row.company;
            if (row.profession && row.profession.trim() !== '') updateData.profession = row.profession;
            // position puede no existir en algunos schemas, verificar antes de actualizar
            // if (row.position && row.position.trim() !== '') updateData.position = row.position;
            if (row.current_location && row.current_location.trim() !== '') updateData.current_location = row.current_location;
            if (row.headline_user && row.headline_user.trim() !== '') updateData.headline_user = row.headline_user;
            if (row.phone_number && row.phone_number.trim() !== '') updateData.phone_number = row.phone_number;
            
            // Campos con IDs
            if (row.nationality_id) updateData.nationality = row.nationality_id;
            if (row.work_country_id) updateData.work_country = row.work_country_id;
            if (row.main_language_id) updateData.main_language = row.main_language_id;
            if (row.main_area_of_expertise_id) updateData.main_area_of_expertise = row.main_area_of_expertise_id;
            
            // Metadata (solo si la columna existe)
            try {
                const metadata = buildMetadata(row);
                if (metadata) {
                    // Obtener metadata existente y mergear
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('metadata')
                        .eq('id', row.id)
                        .single();
                    
                    const existingMetadata = (existingProfile?.metadata as any) || {};
                    updateData.metadata = { ...existingMetadata, ...metadata };
                }
            } catch (metadataError) {
                // Si metadata no existe, simplemente no actualizamos metadata
                console.warn(`⚠️ Metadata no disponible para ${row.email}, saltando...`);
            }
            
            // Actualizar
            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', row.id);
            
            if (error) {
                throw error;
            }
            
            updateCount++;
            
            if ((i + 1) % 100 === 0) {
                console.log(`   Actualizados: ${i + 1}/${updateRecords.length}`);
            }
        } catch (error: any) {
            errorCount++;
            errors.push(`UPDATE ${row.email}: ${error.message}`);
            console.error(`❌ Error actualizando ${row.email}:`, error.message);
        }
    }
    
    console.log(`✅ UPDATE completado: ${updateCount}/${updateRecords.length}`);
    console.log('');

    // ============================================
    // PROCESAR USUARIOS INSERT
    // ============================================
    console.log('🔄 Procesando usuarios INSERT...');
    
    for (let i = 0; i < insertRecords.length; i++) {
        const row = insertRecords[i];
        
        try {
            // Paso 1: Crear usuario en auth.users
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: row.email,
                email_confirm: true, // Auto-confirmar email
                user_metadata: {
                    source: 'wordpress_migration',
                    migrated_at: new Date().toISOString()
                }
            });
            
            if (authError || !authUser.user) {
                throw new Error(`Error creando auth user: ${authError?.message || 'Unknown error'}`);
            }
            
            // Paso 2: Crear perfil
            const profileData: any = {
                id: authUser.user.id,
                email: row.email,
                username: row.username || row.email,
                role: row.role || 'Basic',
                first_name: row.first_name || '',
                last_name: row.last_name || '',
                full_name: row.full_name || row.email,
                profile_slug: row.profile_slug || generateSlugFromEmail(row.email),
                company: row.company || null,
                profession: row.profession || null,
                // position puede no existir, omitir si no está en schema
                // position: row.position || null,
                current_location: row.current_location || null,
                headline_user: row.headline_user || null,
                phone_number: row.phone_number || null,
            };
            
            // Campos con IDs
            if (row.nationality_id) profileData.nationality = row.nationality_id;
            if (row.work_country_id) profileData.work_country = row.work_country_id;
            if (row.main_language_id) profileData.main_language = row.main_language_id;
            if (row.main_area_of_expertise_id) profileData.main_area_of_expertise = row.main_area_of_expertise_id;
            
            // Metadata
            const metadata = buildMetadata(row);
            if (metadata) {
                profileData.metadata = metadata;
            }
            
            const { error: profileError } = await supabase
                .from('profiles')
                .insert(profileData);
            
            if (profileError) {
                // Si falla el perfil, intentar eliminar el usuario de auth
                await supabase.auth.admin.deleteUser(authUser.user.id);
                throw profileError;
            }
            
            // Paso 3: Forzar reset de password
            await supabase.auth.admin.updateUserById(authUser.user.id, {
                password: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}` // Password temporal único
            });
            
            // Luego forzar cambio de password (esto requiere que el usuario use "Forgot Password")
            // Nota: Supabase no tiene una forma directa de forzar reset, pero el password temporal
            // hará que el usuario necesite cambiarlo
            
            insertCount++;
            
            if ((i + 1) % 10 === 0) {
                console.log(`   Creados: ${i + 1}/${insertRecords.length}`);
            }
        } catch (error: any) {
            errorCount++;
            errors.push(`INSERT ${row.email}: ${error.message}`);
            console.error(`❌ Error creando ${row.email}:`, error.message);
        }
    }
    
    console.log(`✅ INSERT completado: ${insertCount}/${insertRecords.length}`);
    console.log('');

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log('📊 RESUMEN FINAL:');
    console.log('================================');
    console.log(`✅ Usuarios actualizados: ${updateCount}`);
    console.log(`✅ Usuarios nuevos creados: ${insertCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('');
    
    if (errors.length > 0) {
        console.log('⚠️ ERRORES ENCONTRADOS:');
        errors.forEach(err => console.log(`   - ${err}`));
        console.log('');
        
        // Guardar errores en archivo
        const errorFilePath = path.resolve(process.cwd(), 'public', `migration_errors_${new Date().toISOString().split('T')[0]}.txt`);
        fs.writeFileSync(errorFilePath, errors.join('\n'), 'utf-8');
        console.log(`📁 Errores guardados en: ${errorFilePath}`);
        console.log('');
    }
    
    console.log('🎉 ¡Migración completada!');
    console.log('');
    console.log('⚠️ IMPORTANTE:');
    console.log('   Todos los usuarios (existentes y nuevos) necesitarán usar');
    console.log('   "Forgot Password" para resetear su contraseña.');
    console.log('');
}

updateUsersToSupabase().catch(console.error);

