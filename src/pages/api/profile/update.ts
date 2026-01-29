import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient({ req: request, cookies });

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2. Parse Body
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const {
        first_name,
        last_name,
        full_name,
        headline_user,
        username,
        phone_number,
        country, // Receive country
        nationality, // Keep for backward compatibility if needed, but prefer country
        current_location,
        profession,
        company,
        position,
        work_country,
        linkedin_url,
        main_language,
        main_area_of_expertise,
        avatar_url,
        metadata,
    } = body;

    // 3. Prepare update data (only include fields that are provided)
    const updateData: any = {};

    // Actualizar first_name y last_name si están disponibles (las columnas deberían existir)
    if (first_name !== undefined) updateData.first_name = first_name || null;
    if (last_name !== undefined) updateData.last_name = last_name || null;

    // Generar full_name desde first_name y last_name si están disponibles
    if (first_name !== undefined || last_name !== undefined) {
        const firstName = first_name || '';
        const lastName = last_name || '';
        const generatedFullName = `${firstName} ${lastName}`.trim();
        if (generatedFullName) {
            updateData.full_name = generatedFullName;
        }
    }

    // Si full_name viene explícitamente, usarlo (tiene prioridad)
    if (full_name !== undefined && full_name) {
        updateData.full_name = full_name;
    }

    if (headline_user !== undefined) updateData.headline_user = headline_user || null;
    if (username !== undefined) updateData.username = username || null;
    if (phone_number !== undefined) updateData.phone_number = phone_number || null;

    // Handle Country (Legacy Nationality)
    if (country !== undefined) updateData.country = country || null;
    else if (nationality !== undefined) updateData.country = nationality || null; // Fallback for old payloads

    if (current_location !== undefined) updateData.current_location = current_location || null;
    if (profession !== undefined) updateData.profession = profession || null;
    if (company !== undefined) updateData.company = company || null;
    if (position !== undefined) updateData.position = position || null;
    if (work_country !== undefined) updateData.work_country = work_country || null;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url || null;
    if (main_language !== undefined) updateData.main_language = main_language || null;
    if (main_area_of_expertise !== undefined) updateData.main_area_of_expertise = main_area_of_expertise || null;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url || null;
    if (metadata !== undefined) updateData.metadata = metadata;

    // 4. Update profile (only the user's own profile)
    const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Profile update error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
};

