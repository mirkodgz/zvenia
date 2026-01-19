
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader, type CookieOptions } from '@supabase/ssr';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

// Client-side client (Singleton for browser)
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);

import type { AstroCookies } from 'astro';

// SSR Client Generator (for API routes & actions)
export const createSupabaseServerClient = (context: {
    req: Request;
    res?: Response;
    cookies?: AstroCookies;
}) => {
    return createServerClient<Database>(supabaseUrl, supabaseKey, {
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
                        secure: false, // HARDCODED FALSE: Crucial for localhost OAuth flow
                        sameSite: 'lax',
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7, // 1 week (Force persistence)
                    });
                    return;
                }
            },
            remove(key, options) {
                if (context.cookies) {
                    context.cookies.delete(key, options);
                    return;
                }
            },
        },
    });
};

// For admin operations (migration scripts only)
// CAUTION: Never expose this on the client side
export function getServiceSupabase() {
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
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
