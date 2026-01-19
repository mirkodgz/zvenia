
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in .env");
        return;
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Connected to DB via pg.");

        // Check Policies
        const res = await client.query(`
      SELECT policyname, cmd, roles, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'social_likes';
    `);

        console.log("Existing Policies for 'social_likes':");
        console.table(res.rows);

        // Check if RLS is enabled
        const res2 = await client.query(`
        SELECT relname, relrowsecurity, relforcerowsecurity
        FROM pg_class
        WHERE oid = 'social_likes'::regclass;
    `);
        console.log("RLS Status:");
        console.table(res2.rows);

    } catch (err) {
        console.error("Error connecting or querying:", err);
    } finally {
        await client.end();
    }
}
run();
