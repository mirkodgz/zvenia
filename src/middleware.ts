
import { defineMiddleware } from "astro:middleware";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const onRequest = defineMiddleware(async (context, next) => {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase environment variables missing in middleware");
        return next();
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            get(key) {
                return context.cookies.get(key)?.value;
            },
            set(key, value, options) {
                context.cookies.set(key, value, options);
            },
            remove(key, options) {
                context.cookies.delete(key, options);
            },
        },
    });

    context.locals.supabase = supabase;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, country')
            .eq('id', user.id)
            .single();

        // Attach role/country to the user object in locals
        // Note: verify if we can mutate the user object directly or need to extend the type. 
        // For now, attaching to user object as ad-hoc properties or metadata is common in Astro/Supabase patterns unless using a strict User type.
        // Let's attach them to user_metadata or directly if TS permits, but easier to extend context.locals.user
        if (profile) {
            (user as any).role = profile.role || 'Basic';
            (user as any).country = profile.country;
        }
    }

    context.locals.user = user;

    return next();
});
