import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "@supabase/ssr";
import { createSupabaseServerClient } from "./lib/supabase";
import { hasAdminAccess, isAdministrator, type UserRole } from "./lib/admin/roles";

export const onRequest = defineMiddleware(async (context, next) => {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase environment variables missing in middleware");
        return next();
    }

    // Crear cliente Supabase general
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

    // Obtener usuario autenticado
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Si hay usuario, obtener su perfil
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, country, full_name, first_name, last_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (profile) {
            (user as any).role = profile.role || 'Basic';
            (user as any).country = profile.country;
            (user as any).full_name = profile.full_name;
            (user as any).first_name = profile.first_name;
            (user as any).last_name = profile.last_name;
            (user as any).avatar_url = profile.avatar_url;
        }

        context.locals.user = user;
        context.locals.profile = profile ? {
            id: user.id,
            email: user.email!,
            role: (profile.role || 'Basic') as UserRole,
            full_name: profile.full_name || user.email!,
            avatar_url: profile.avatar_url || null,
        } : null;
    } else {
        context.locals.user = null;
        context.locals.profile = null;
    }

    // Redirecciones 301: WordPress legacy URLs → Astro new URLs
    // Esto es CRÍTICO para SEO y enlaces antiguos (LinkedIn, bookmarks, etc.)
    if (context.url.pathname.startsWith('/z-posts/')) {
        const slug = context.url.pathname.replace('/z-posts/', '').replace(/\/$/, '');
        if (slug) {
            // Redirección 301 permanente de /z-posts/[slug] a /post/[slug]
            return context.redirect(`/post/${slug}`, 301);
        }
    }

    // Protección de rutas /admin/*
    if (context.url.pathname.startsWith('/admin')) {
        // Permitir acceso a la página de login
        if (context.url.pathname === '/admin/login') {
            return next();
        }

        // Si no está autenticado, redirigir a login
        if (!user) {
            return context.redirect('/admin/login');
        }

        // Obtener perfil para verificar rol
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (!profile) {
            console.error('Error fetching user profile for admin access');
            return context.redirect('/admin/login');
        }

        const userRole = (profile.role || 'Basic') as UserRole;

        // SOLO Administrator puede acceder al dashboard admin
        if (!isAdministrator(userRole)) {
            // Usuario no es Administrator - redirigir a home
            return context.redirect('/?error=unauthorized');
        }

        // Guardar información del usuario en locals para usar en las páginas
        context.locals.profile = {
            id: user.id,
            email: user.email!,
            role: userRole,
            full_name: profile.full_name || user.email!,
            avatar_url: profile.avatar_url || null,
        };
    }

    return next();
});
