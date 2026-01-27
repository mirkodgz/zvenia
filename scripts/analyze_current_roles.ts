
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Env Vars. Make sure .env is loaded or vars are set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeRoles() {
    console.log("Analyzing current roles distribution...");

    // Fetch all roles
    const { data, error } = await supabase
        .from('profiles')
        .select('role');

    if (error) {
        console.error("Error fetching profiles:", error);
        return;
    }

    const VALID_ROLES = ['Administrator', 'CountryManager', 'Ads', 'Events', 'Expert', 'Basic'];
    const distribution: Record<string, number> = {};
    const mismatches: string[] = [];
    let nulls = 0;

    data.forEach((p: any) => {
        if (!p.role) {
            nulls++;
        } else {
            distribution[p.role] = (distribution[p.role] || 0) + 1;
            if (!VALID_ROLES.includes(p.role)) {
                mismatches.push(p.role);
            }
        }
    });

    console.log("\n--- Role Integrity Check ---");
    console.log("Valid Roles:", VALID_ROLES.join(", "));
    console.table(distribution);
    console.log(`[NULL]: ${nulls}`);

    if (mismatches.length > 0) {
        console.error(`[WARNING] Found ${mismatches.length} users with unknown roles:`, [...new Set(mismatches)]);
    } else {
        console.log("[SUCCESS] All users have valid roles! No data cleanup needed.");
    }
    console.log("----------------------------\n");
}

analyzeRoles();
