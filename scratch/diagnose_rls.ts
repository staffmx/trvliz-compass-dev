import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listTables() {
    const tables = [
        'associates', 'blog_posts', 'sellers', 'notices', 'events', 
        'recorded_webinars', 'audit_logs', 'profiles', 'user_roles', 
        'certifications', 'documents', 'blog_comments'
    ];
    
    console.log("Checking RLS status for tables (via simple select without auth)...");
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
            console.log(`[${table}] Error (Likely RLS enabled):`, error.message);
        } else {
            console.log(`[${table}] Success (RLS likely disabled or public access open)`);
        }
    }
}

listTables();
