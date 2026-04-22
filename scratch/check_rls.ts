import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyRLS() {
    console.log("--- SECURE RLS AUDIT (ANONYMOUS ACCESS) ---");
    
    const tables = ['blog_posts', 'associates', 'profiles', 'audit_logs', 'sellers'];

    for (const table of tables) {
        // We try to select the ID of one row. 
        // If RLS is enabled and no policy allows it, data will be empty [] 
        // or we get a 42501 (Permission Denied).
        const { data, error } = await anonClient.from(table).select('*').limit(1);
        
        if (error) {
            console.log(`[${table}] Result: BLOCKED - ${error.message} (${error.code})`);
        } else if (data && data.length > 0) {
            if (table === 'blog_posts') {
                console.log(`[${table}] Result: PUBLIC (Allowed)`);
            } else {
                console.log(`[${table}] Result: EXPOSED! (Data leaked)`);
            }
        } else {
            console.log(`[${table}] Result: EMPTY/BLOCKED (No data visible)`);
        }
    }
}

verifyRLS();
