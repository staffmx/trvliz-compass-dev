import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkPolicies() {
    console.log("Checking associates table accessibility...");
    const { data, error } = await supabase.from('associates').select('id').limit(1);
    if (error) console.error("Select Error:", error);
    else console.log("Select Success");

    console.log("Attempting a dry-run delete on a non-existent ID...");
    const { error: deleteError } = await supabase.from('associates').delete().eq('id', 0);
    if (deleteError) {
        console.error("Delete Error:", deleteError);
    } else {
        console.log("Delete (dry-run) Success - No RLS block on DELETE command itself.");
    }
}

checkPolicies();
