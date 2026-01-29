import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
    // 1. Init Supabase (User Context)
    const supabase = createSupabaseServerClient({ req: request, cookies });

    // 2. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 3. Parse Body
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const { type, data } = body;

    // 2.1 Fetch User Role
    const { data: rawProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const profile = rawProfile as any;

    const role = profile?.role || 'Basic';

    // 2.2 Define Permissions
    const permissions = {
        post: ['Basic', 'Expert', 'Ads', 'Events', 'CountryManager', 'Administrator'],
        event: ['Events', 'CountryManager', 'Administrator'],
        podcast: ['Expert', 'CountryManager', 'Administrator'],
        service: ['Ads', 'CountryManager', 'Administrator']
    };

    // 2.3 Check Permission
    if (!permissions[type as keyof typeof permissions]?.includes(role)) {
        return new Response(JSON.stringify({
            error: `Permission denied: Role '${role}' cannot create content type '${type}'`
        }), { status: 403 });
    }


    // 4. Handle 'post' type
    if (type === 'post') {
        const { title, slug, excerpt, content, featured_image_url, document_url, topic_id, source, metadata, is_popular } = data;

        // Validation
        if (!title || !slug) {
            return new Response(JSON.stringify({ error: "Title and Slug are required" }), { status: 400 });
        }
        if (!topic_id) {
            return new Response(JSON.stringify({ error: "Topic is required" }), { status: 400 });
        }

        // 4.1 Get Topic UUID
        const { data: topicData, error: topicError } = await supabase
            .from('topics')
            .select('id')
            .eq('slug', topic_id)
            .single();

        if (topicError || !topicData) {
            return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
        }

        // 4.2 Generate Unique Slug
        // 4.2 Check Slug Uniqueness
        const { count } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('slug', slug);

        let finalSlug = slug;
        if (count && count > 0) {
            const uniqueSuffix = Math.random().toString(36).substring(2, 8);
            finalSlug = `${slug}-${uniqueSuffix}`;
        }

        // 4.3 Insert Post
        const { data: insertedPost, error: insertError } = await supabase
            .from('posts')
            .insert({
                title,
                slug: finalSlug,
                excerpt,
                content,
                featured_image_url,
                document_url,
                source,
                author_id: user.id,
                topic_id: (topicData as any).id, // Fix: Save topic_id directly
                metadata: metadata || {},
                is_popular: is_popular || false // Default false
            } as any)
            .select()
            .single();

        if (insertError) {
            console.error("Error creating post:", insertError);
            return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: insertedPost }), { status: 200 });
    }

    // 5. Handle 'event' type
    if (type === 'event') {
        const {
            title,
            slug: providedSlug,
            description,
            topic_id,
            start_date,
            end_date,
            location,
            cover_photo_url,
            organizer,
            organizer_phone,
            organizer_email,
            type_id,
            language_id,
            format_id,
            price_id,
            official_link,
            start_time,
            schedule_pdf_url,
            is_popular
        } = data;

        // Validation
        if (!title || !topic_id || !start_date || !end_date) {
            return new Response(JSON.stringify({ error: "Title, Topic, Start Date and End Date are required" }), { status: 400 });
        }

        // 5.1 Get Topic UUID
        const { data: topicData, error: topicError } = await supabase
            .from('topics')
            .select('id')
            .eq('slug', topic_id)
            .single();

        if (topicError || !topicData) {
            return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
        }

        // 5.2 Check Slug Uniqueness
        const slug = providedSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const { count } = await supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('slug', slug);

        let finalSlug = slug;
        if (count && count > 0) {
            const uniqueSuffix = Math.random().toString(36).substring(2, 8);
            finalSlug = `${slug}-${uniqueSuffix}`;
        }

        // 5.3 Insert Event
        const { data: insertedEvent, error: insertError } = await supabase
            .from('events')
            .insert({
                title,
                slug: finalSlug,
                description,
                start_date,
                end_date,
                location,
                featured_image_url: cover_photo_url, // For card display
                cover_photo_url, // For internal page header
                schedule_pdf_url, // New PDF Schedule
                organizer,
                organizer_phone,
                organizer_email,
                type_id,
                language_id,
                format_id,
                price_id,
                external_link: official_link,
                start_time,
                author_id: user.id,
                topic_id: (topicData as any).id, // Fix: Save topic_id
                is_popular: is_popular || false
            } as any)
            .select()
            .single();

        if (insertError) {
            console.error("Error creating event:", insertError);
            return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: insertedEvent }), { status: 200 });
    }

    // 6. Handle 'podcast' type
    if (type === 'podcast') {
        const {
            title,
            description,
            topic_id,
            host,
            featured_image_url,
            episodes, // JSONB Array
            is_popular
        } = data;

        if (!title || !topic_id) {
            return new Response(JSON.stringify({ error: "Title and Topic are required" }), { status: 400 });
        }

        // 6.1 Get Topic UUID
        const { data: topicData, error: topicError } = await supabase
            .from('topics')
            .select('id')
            .eq('slug', topic_id)
            .single();

        if (topicError || !topicData) {
            return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
        }

        // 6.2 Check Slug Uniqueness
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const { count: podCount } = await supabase
            .from('podcasts')
            .select('id', { count: 'exact', head: true })
            .eq('slug', slug);

        let finalSlug = slug;
        if (podCount && podCount > 0) {
            const uniqueSuffix = Math.random().toString(36).substring(2, 8);
            finalSlug = `${slug}-${uniqueSuffix}`;
        }

        // 6.3 Insert Podcast
        const { data: insertedPodcast, error: insertError } = await supabase
            .from('podcasts')
            .insert({
                title,
                slug: finalSlug,
                description,
                host,
                cover_image_url: featured_image_url,
                episodes: episodes || [],
                topic_id: (topicData as any).id, // Direct Relation
                author_id: user.id,
                is_popular: is_popular || false
            } as any)
            .select()
            .single();

        if (insertError) {
            console.error("Error creating podcast:", insertError);
            return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: insertedPodcast }), { status: 200 });
    }

    // 7. Handle 'service' type
    if (type === 'service') {
        const {
            title,
            description,
            topic_id,
            type_id,
            duration_id,
            target_country,
            organizer_company,
            company_link,
            contact_email,
            featured_image_url,
            is_popular
        } = data;

        if (!title || !topic_id) {
            return new Response(JSON.stringify({ error: "Title and Topic are required" }), { status: 400 });
        }

        // 7.1 Get Topic UUID
        const { data: topicData, error: topicError } = await supabase
            .from('topics')
            .select('id')
            .eq('slug', topic_id)
            .single();

        if (topicError || !topicData) {
            return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
        }

        // 7.2 Check Slug Uniqueness
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const { count: servCount } = await supabase
            .from('services')
            .select('id', { count: 'exact', head: true })
            .eq('slug', slug);

        let finalSlug = slug;
        if (servCount && servCount > 0) {
            const uniqueSuffix = Math.random().toString(36).substring(2, 8);
            finalSlug = `${slug}-${uniqueSuffix}`;
        }

        // 7.3 Insert Service
        const { data: insertedService, error: insertError } = await supabase
            .from('services')
            .insert({
                title,
                slug: finalSlug,
                content: description, // Map form 'description' to DB 'content'
                topic_id: (topicData as any).id,
                type_id: type_id || null,
                duration_id: duration_id || null,
                target_country,
                organizer_company,
                company_link,
                contact_email,
                featured_image_url,
                quick_view_image_url: featured_image_url, // Sync for now
                author_id: user.id,
                is_popular: is_popular || false
            } as any)
            .select()
            .single();

        if (insertError) {
            console.error("Error creating service:", insertError);
            return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: insertedService }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid content type" }), { status: 400 });
};
