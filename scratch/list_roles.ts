import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkRoles() {
    console.log("Fetching distinct roles from user_roles...");
    const { data, error } = await supabase.from('user_roles').select('role');
    if (error) {
        console.error("Error:", error);
    } else if (data) {
        const roles = [...new Set(data.map(r => r.role))];
        console.log("Roles found:", roles);
    } else {
        console.log("No data returned.");
    }
}

checkRoles();
