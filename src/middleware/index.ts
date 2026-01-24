import type { MiddlewareHandler } from 'astro';
import { createSupabaseServerClient } from '../lib/supabase';
import { hasAdminAccess, isAdministrator, type UserRole } from '../lib/admin/roles';

export const onRequest: MiddlewareHandler = async ({ request, cookies, redirect, locals, url }, next) => {
    // Solo proteger rutas /admin/*
    if (!url.pathname.startsWith('/admin')) {
        return next();
    }

    // Permitir acceso a la página de login
    if (url.pathname === '/admin/login') {
        return next();
    }

    // Crear cliente Supabase
    const supabase = createSupabaseServerClient({ req: request, cookies });

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        // No autenticado - redirigir a login
        return redirect('/admin/login');
    }

    // Obtener perfil y rol del usuario
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error('Error fetching user profile:', profileError);
        return redirect('/admin/login');
    }

    const userRole = (profile.role || 'Basic') as UserRole;

    // Verificar que el usuario tiene acceso al dashboard admin
    if (!hasAdminAccess(userRole)) {
        // Usuario no tiene permisos de admin - redirigir a home
        return redirect('/?error=unauthorized');
    }

    // Rutas que solo puede acceder el Administrator
    const adminOnlyRoutes = ['/admin/users', '/admin/settings'];
    const isAdminOnlyRoute = adminOnlyRoutes.some(route => url.pathname.startsWith(route));

    if (isAdminOnlyRoute && !isAdministrator(userRole)) {
        // Solo Administrator puede acceder - redirigir a dashboard
        return redirect('/admin?error=forbidden');
    }

    // Guardar información del usuario en locals para usar en las páginas
    locals.user = user;
    locals.profile = {
        id: user.id,
        email: user.email!,
        role: userRole,
        full_name: profile.full_name || user.email!,
        avatar_url: profile.avatar_url || null,
    };

    return next();
};
