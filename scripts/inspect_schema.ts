
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
    console.log("Fetching one profile...");
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Columns found via Select *:");
        const keys = Object.keys(data[0]);
        console.log(keys);

        const hasCountry = keys.includes("country");
        const hasWorkCountry = keys.includes("work_country");
        const hasNationality = keys.includes("nationality");

        console.log("\n--- Audit Results ---");
        console.log(`Has 'country' column: ${hasCountry}`);
        console.log(`Has 'work_country' column: ${hasWorkCountry}`);
        console.log(`Has 'nationality' column: ${hasNationality}`);
    } else {
        console.log("No profiles found to inspect.");
    }
}

inspect();
