import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectSchema() {
    console.log("--- Inspecting Sellers Table ---");
    const { data: sellerData, error: sellerError } = await supabase.from('sellers').select('*').limit(1);
    if (sellerError) console.error("Sellers Error:", sellerError);
    else console.log("Sellers Sample:", sellerData);

    console.log("--- Inspecting Profiles Table ---");
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').limit(1);
    if (profileError) console.error("Profiles Error:", profileError);
    else console.log("Profiles Sample:", profileData);
}

inspectSchema();
