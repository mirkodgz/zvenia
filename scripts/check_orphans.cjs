
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkOrphans() {
    console.log("Checking for 'team' profile...");

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or('email.eq.team@dgzconsulting.com,username.eq.team,username.eq.team@dgzconsulting.com');

    if (error) {
        console.error('Error:', error);
    } else {
        if (profiles.length > 0) {
            console.log('⚠️ Found potential orphans ORPHANED PROFILE(S):');
            console.table(profiles);

            // Check if their ID exists in auth.users
            for (const p of profiles) {
                const { data: { user }, error: authErr } = await supabase.auth.admin.getUserById(p.id);
                if (authErr || !user) {
                    console.log(`   ❌ Profile ${p.id} has NO matching Auth User! (Orphan)`);

                    // Cleanup
                    console.log('   🧹 Deleting orphan...');
                    await supabase.from('profiles').delete().eq('id', p.id);
                } else {
                    console.log(`   ✅ Profile ${p.id} HAS matching Auth User.`);
                }
            }
        } else {
            console.log('✅ No profiles found for team/team@dgzconsulting.com. Clean slate.');
        }
    }
}

checkOrphans();
