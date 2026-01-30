
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader, type CookieOptions } from '@supabase/ssr';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Warn instead of crash on client init - lets the app boot even if Supabase is misconfigured
if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase environment variables! Check .env or Vercel Settings.');
}

// Client-side client (Singleton for browser)
// createBrowserClient maneja las cookies automáticamente
export const supabase = createBrowserClient<Database>(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseKey || "placeholder-key"
);

import type { AstroCookies } from 'astro';

// SSR Client Generator (for API routes & actions)
export const createSupabaseServerClient = (context: {
    req: Request;
    res?: Response;
    cookies?: AstroCookies;
}) => {
    // Fail gracefully in SSR if vars are missing
    if (!supabaseUrl || !supabaseKey) {
        console.error('SSR Supabase Init Failed: Missing ENV vars');
    }

    return createServerClient<Database>(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseKey || "placeholder-key",
        {
            cookieOptions: {
                secure: import.meta.env.PROD, // Only use secure cookies in production (HTTPS)
                sameSite: 'lax',
                path: '/',
            },
            cookies: {
                get(key) {
                    if (context.cookies) {
                        const cookie = context.cookies.get(key);
                        return cookie?.value;
                    }
                    const cookies = parseCookieHeader(context.req.headers.get('Cookie') ?? '');
                    return cookies.find((c) => c.name === key)?.value;
                },
                set(key, value, options) {
                    if (context.cookies) {
                        context.cookies.set(key, value, {
                            ...options,
                            path: '/',
                            secure: import.meta.env.PROD, // Dynamic: false on local, true on prod
                            sameSite: 'lax',
                            httpOnly: true, // Keep it HttpOnly for security
                            maxAge: 60 * 60 * 24 * 7, // 1 week (Force persistence)
                        });
                        return;
                    }
                },
                remove(key, options) {
                    if (context.cookies) {
                        context.cookies.delete(key, {
                            ...options,
                            path: '/',
                            secure: import.meta.env.PROD, // Match set() to ensure deletion works
                            sameSite: 'lax',
                            httpOnly: true,
                        });
                        return;
                    }
                },
            },
        });
};

// For admin operations (migration scripts only)
// CAUTION: Never expose this on the client side
export function getServiceSupabase() {
    // Only use import.meta.env for Vercel/Vite compatibility
    // Fallback to process.env ONLY if running in a pure Node script (e.g. tsx scripts/...)
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient<Database>(supabaseUrl!, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
