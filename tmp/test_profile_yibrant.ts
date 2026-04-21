import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkProfile() {
    console.log("Signing in as yibrant...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'yibrant@internationalcruises.mx',
        password: 'Traveliz2026!'
    });

    if (authError) {
        console.error("Auth Error:", authError.message);
        return;
    }

    const userId = authData.user.id;
    console.log("Logged in. User ID:", userId);

    try {
        let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
        console.log("Profile check error:", error);
        console.log("Profile data:", data);

        if (data) {
           const { data: uRolesRaw, error: urErr } = await supabase
             .from('user_roles')
             .select('*')
             .eq('user_id', data.id);
           console.log("User roles check error:", urErr);
           console.log("User roles data:", uRolesRaw);
        }

    } catch(err) {
        console.error("Catch block:", err);
    }
}

checkProfile().catch(console.error);
