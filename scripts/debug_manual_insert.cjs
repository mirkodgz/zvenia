
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTriggerSource() {
    // We can use rpc if we had one, but we don't.
    // We can try to query pg_proc via 'rpc' if we created a helper? No.
    // We can only query exposed tables. System tables are usually hidden from API.

    // BUT! I can use my 'debug_constraints' trick.
    // Try to insert a row that I KNOW will fail, and see if the *Trigger* code is mentioned in the error stack? No.

    console.log("Checking function source is hard via API.");
    console.log("Assuming the user acts on good faith.");

    // Let's assume the user DID run it.
    // Maybe the error is NOT the trigger.
    // "Unexpected failure" from Auth API often means the Auth Service internal error (e.g. SMTP config? Rate limit?).
    // But I'm using "gmail.com".

    // Wait. "Unexpected failure" is specific.
    // If I use a KNOWN existing email, I get "User already registered".
    // If I use a NEW email and get "Unexpected failure", it's the DB insert failing.

    // Let's try to manually CALL the trigger function? NO, it relies on NEW.

    // Let's providing a V4 script that is ABSOLUTELY minimal.
    // Remove 'country' and 'profession' again, just to see if we can revert to a working state?
    // No, that moves backwards.

    // Let's try to insert into profiles directly WITH minimal fields to see if IT works.
    // If I insert `id, email, username, role` manually, does it work?
    const testId = '11111111-1111-1111-1111-111111111111';
    const { error } = await supabase.from('profiles').insert({
        id: testId,
        email: 'manual_verify@test.com',
        username: 'manual_verify',
        role: 'Basic',
        full_name: 'Manual Gen' // providing 'country' is NULL here
    });

    if (error) {
        console.log('Manual Insert Failed:', error.message);
        if (error.message.includes('foreign key')) {
            console.log('>> It is a foreign key issue (Expected if ID not in auth.users).');
        }
    } else {
        console.log('Manual Insert Succeeded!');
        await supabase.from('profiles').delete().eq('id', testId);
    }
}

checkTriggerSource();
