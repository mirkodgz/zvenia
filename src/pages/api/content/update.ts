
import type { APIRoute } from "astro";
import { createSupabaseServerClient, getServiceSupabase } from "../../../lib/supabase";

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
        id,
        type, // 'post' | 'event'
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        document_url,
        topic_id,
        source,
        metadata,
        // Event Specific
        description,
        start_date,
        end_date,
        start_time,
        location,
        external_link,
        event_type_id,
        event_language_id,
        event_format_id,
        event_price_id,
        // Organizer (Flattened in DB now)
        organizer,
        organizer_email,
        organizer_phone,
        // Podcast Specific
        host,
        episodes, // JSONB Array
        is_popular // New Field
    } = body;

    if (!id) {
        return new Response(JSON.stringify({ error: "Content ID required" }), { status: 400 });
    }

    const isEvent = type === 'event';
    const isPodcast = type === 'podcast';
    const isService = type === 'service';

    let table = 'posts';
    if (isEvent) table = 'events';
    if (isPodcast) table = 'podcasts';
    if (isService) table = 'services';

    // 3. Verify Ownership & Permissions
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as any;

    const userRole = profile?.role || 'Basic';
    const isModerator = ['Administrator', 'CountryManager'].includes(userRole);

    const { data: itemToCheck, error: fetchError } = await supabase
        .from(table)
        .select('author_id')
        .eq('id', id)
        .single() as any;

    if (fetchError || !itemToCheck) {
        return new Response(JSON.stringify({ error: `${isEvent ? 'Event' : 'Post'} not found` }), { status: 404 });
    }

    if (itemToCheck.author_id !== user.id && !isModerator) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // 4. Validations
    if (!title) {
        return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
    }

    // Resolve Topic UUID
    let topicUUID = null;
    if (topic_id) {
        // If topic_id is a slug (from form), resolve it. If it's already a UUID, this might fail or we need specific check.
        // The form sends slug.
        // The form sends slug.
        const { data: tData } = await supabase.from('topics').select('id').eq('slug', topic_id).single() as any;
        if (tData) topicUUID = tData.id;
    }

    // 5. Update Content
    let updatePayload: any = {};

    if (isEvent) {
        updatePayload = {
            title,
            slug,
            description,
            start_date,
            end_date,
            start_time,
            location,
            featured_image_url, // Standard field
            cover_photo_url: featured_image_url, // Redundant field in events table from migration
            schedule_pdf_url: document_url, // Map generic 'document_url' to event-specific 'schedule_pdf_url'
            external_link,
            type_id: event_type_id || null,      // Map to DB column
            language_id: event_language_id || null,
            format_id: event_format_id || null,
            price_id: event_price_id || null,
            organizer,           // Flattened columns
            organizer_email,
            organizer_phone,
            metadata: metadata || {}
        };
    } else if (isPodcast) {
        // Podcast
        updatePayload = {
            title,
            slug,
            description,
            host,
            cover_image_url: featured_image_url,
            episodes: body.episodes || [], // JSONB
            // topic_id is updated separately or we can put it here if the column exists directly. 
            // Since we handle topic specifically below, we'll leave it there to be consistent, 
            // or just rely on the separate block. Let's rely on the separate block for topic.
        };
    } else if (isService) {
        updatePayload = {
            title,
            slug,
            content: description, // Map form 'description' to DB 'content'
            target_country: body.target_country,
            organizer_company: body.organizer_company,
            company_link: body.company_link,
            contact_email: body.contact_email,
            type_id: body.type_id || null,
            duration_id: body.duration_id || null,
            featured_image_url,
            quick_view_image_url: featured_image_url // sync
        };
    } else {
        // Post
        updatePayload = {
            title,
            slug,
            excerpt,
            content,
            featured_image_url: featured_image_url || null,
            document_url: document_url || null,
            source: source || null,
            metadata: metadata || {},
            is_popular: is_popular // Update Popular Status
        };
    }

    // Use service role if moderator to bypass RLS "auth.uid() = author_id"
    const dbClient = isModerator ? getServiceSupabase() : supabase;

    console.log(`[API Update] User: ${user.id} | Role: ${userRole} | IsModerator: ${isModerator} | Client: ${isModerator ? 'SERVICE' : 'STANDARD'}`);

    const { error: updateError, count } = await (dbClient
        .from(table) as any)
        .update(updatePayload)
        .eq('id', id)
        .select('*', { count: 'exact' }); // Request count

    if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    if (count === 0) {
        console.error(`[API Update] Update silently failed (Count 0). RLS likely blocked it.`);
        return new Response(JSON.stringify({ error: "Update failed: Permission denied (RLS blocked update)" }), { status: 403 });
    }



    // 6. Update Topic Relation if changed
    if (topicUUID) {
        // Unified update for all content types (posts, events, podcasts, services)
        // All tables now populate 'topic_id' directly.
        await (dbClient.from(table) as any).update({ topic_id: topicUUID }).eq('id', id);
    }

    return new Response(JSON.stringify({ success: true, slug: slug }), { status: 200 });
};
