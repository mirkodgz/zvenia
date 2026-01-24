
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
    const supabase = createSupabaseServerClient({ req: request, cookies });
    await supabase.auth.signOut();
    return redirect("/", 302);
};
