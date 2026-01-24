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
    
    if (row.metadata_others_languages) {
        const langIds = row.metadata_others_languages.split(';').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        if (langIds.length > 0) metadata.others_languages = langIds;
    }
    
    if (row.metadata_others_areas_of_expertise) {
        const areaIds = row.metadata_others_areas_of_expertise.split(';').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        if (areaIds.length > 0) metadata.others_areas_of_expertise = areaIds;
    }
    
    if (row.metadata_z_promoter_why || row.metadata_z_promoter_contribute) {
        metadata.z_promoter = {};
        if (row.metadata_z_promoter_why) metadata.z_promoter.why = row.metadata_z_promoter_why;
        if (row.metadata_z_promoter_contribute) metadata.z_promoter.contribute = row.metadata_z_promoter_contribute;
        if (row.metadata_z_promoter_priority_1_id) metadata.z_promoter.priority_1 = parseInt(row.metadata_z_promoter_priority_1_id);
        if (row.metadata_z_promoter_priority_2_id) metadata.z_promoter.priority_2 = parseInt(row.metadata_z_promoter_priority_2_id);
        if (row.metadata_z_promoter_priority_3_id) metadata.z_promoter.priority_3 = parseInt(row.metadata_z_promoter_priority_3_id);
    }
    
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
            if (adIds.length > 0) metadata.z_ads.where_to_advertise = adIds;
        }
    }
    
    return Object.keys(metadata).length > 0 ? metadata : null;
}

async function fixFailedInserts() {
    console.log('🔧 Intentando corregir usuarios INSERT fallidos...');
    console.log('');

    // Leer CSV completo
    const csvPath = path.resolve(process.cwd(), 'public', 'users_complete_2026-01-22.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records: any[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
    });
    
    const insertRecords = records.filter(r => r.action === 'INSERT');
    
    console.log(`📊 Usuarios INSERT a procesar: ${insertRecords.length}`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < insertRecords.length; i++) {
        const row = insertRecords[i];
        const email = row.email;
        
        console.log(`\n🔄 Procesando ${i + 1}/${insertRecords.length}: ${email}`);
        
        try {
            // Paso 1: Verificar si el usuario ya existe en auth.users
            const { data: { users } } = await supabase.auth.admin.listUsers();
            const existingAuthUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            
            let userId: string;
            
            if (existingAuthUser) {
                console.log(`   ✅ Usuario ya existe en auth.users, usando ID existente`);
                userId = existingAuthUser.id;
            } else {
                // Crear nuevo usuario
                console.log(`   📝 Creando nuevo usuario en auth.users...`);
                const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                    email: email,
                    email_confirm: true,
                    user_metadata: {
                        source: 'wordpress_migration',
                        migrated_at: new Date().toISOString()
                    }
                });
                
                if (authError || !authUser.user) {
                    throw new Error(`Error creando auth user: ${authError?.message || 'Unknown error'}`);
                }
                
                userId = authUser.user.id;
                console.log(`   ✅ Usuario creado en auth.users`);
            }
            
            // Paso 2: Verificar si el perfil ya existe
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
            
            if (existingProfile) {
                console.log(`   ⚠️ Perfil ya existe, actualizando...`);
                
                // Actualizar perfil existente
                const updateData: any = {
                    email: email,
                    username: row.username || email,
                    role: row.role || 'Basic',
                    first_name: row.first_name || '',
                    last_name: row.last_name || '',
                    full_name: row.full_name || email,
                    profile_slug: row.profile_slug || generateSlugFromEmail(email),
                    company: row.company || null,
                    profession: row.profession || null,
                    current_location: row.current_location || null,
                    headline_user: row.headline_user || null,
                    phone_number: row.phone_number || null,
                };
                
                if (row.nationality_id) updateData.nationality = row.nationality_id;
                if (row.work_country_id) updateData.work_country = row.work_country_id;
                if (row.main_language_id) updateData.main_language = row.main_language_id;
                if (row.main_area_of_expertise_id) updateData.main_area_of_expertise = row.main_area_of_expertise_id;
                
                const metadata = buildMetadata(row);
                if (metadata) {
                    const { data: currentProfile } = await supabase
                        .from('profiles')
                        .select('metadata')
                        .eq('id', userId)
                        .single();
                    const existingMetadata = (currentProfile?.metadata as any) || {};
                    updateData.metadata = { ...existingMetadata, ...metadata };
                }
                
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update(updateData)
                    .eq('id', userId);
                
                if (updateError) throw updateError;
                
                console.log(`   ✅ Perfil actualizado`);
            } else {
                console.log(`   📝 Creando nuevo perfil...`);
                
                // Crear nuevo perfil
                const profileData: any = {
                    id: userId,
                    email: email,
                    username: row.username || email,
                    role: row.role || 'Basic',
                    first_name: row.first_name || '',
                    last_name: row.last_name || '',
                    full_name: row.full_name || email,
                    profile_slug: row.profile_slug || generateSlugFromEmail(email),
                    company: row.company || null,
                    profession: row.profession || null,
                    current_location: row.current_location || null,
                    headline_user: row.headline_user || null,
                    phone_number: row.phone_number || null,
                };
                
                if (row.nationality_id) profileData.nationality = row.nationality_id;
                if (row.work_country_id) profileData.work_country = row.work_country_id;
                if (row.main_language_id) profileData.main_language = row.main_language_id;
                if (row.main_area_of_expertise_id) profileData.main_area_of_expertise = row.main_area_of_expertise_id;
                
                const metadata = buildMetadata(row);
                if (metadata) {
                    profileData.metadata = metadata;
                }
                
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert(profileData);
                
                if (profileError) throw profileError;
                
                console.log(`   ✅ Perfil creado`);
            }
            
            successCount++;
            console.log(`   ✅ ${email} procesado exitosamente`);
            
        } catch (error: any) {
            errorCount++;
            const errorMsg = `${email}: ${error.message}`;
            errors.push(errorMsg);
            console.error(`   ❌ Error: ${error.message}`);
        }
    }
    
    console.log('');
    console.log('📊 RESUMEN:');
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('');
    
    if (errors.length > 0) {
        console.log('⚠️ ERRORES:');
        errors.forEach(err => console.log(`   - ${err}`));
    }
}

fixFailedInserts().catch(console.error);

