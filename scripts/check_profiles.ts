
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUtc = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

async function checkProfiles() {
    console.log("Checking profiles...");

    // Fetch some profiles to see roles
    const { data: profiles, error } = await supabaseUtc
        .from("profiles")
        .select("id, full_name, role, country")
        .limit(20);

    if (error) {
        console.error("Error fetching profiles:", error);
        return;
    }

    console.log("Found profiles:", profiles.length);
    console.table(profiles);

    // Check specific query
    const { data: cms } = await supabaseUtc
        .from("profiles")
        .select("id, full_name")
        .eq("role", "CountryManager");

    console.log("CM Query Count:", cms?.length);
}

checkProfiles();
