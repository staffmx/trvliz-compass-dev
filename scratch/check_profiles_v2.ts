import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUsers() {
    const emails = [
        'test_admin@traveliz.com',
        'test_superadmin@traveliz.com',
        'test_editor_avisos@traveliz.com',
        'test_editor_blogs@traveliz.com'
    ];
    
    const { data: profiles, error: pError } = await supabase.from('profiles').select('email, full_name').in('email', emails);
    if (pError) console.error('Error fetching profiles:', pError);

    const { data: userRoles, error: rError } = await supabase.from('user_roles').select('*, roles(name)').in('user_id', profiles?.map(p => p.id) || []);
    
    console.log('--- PROFILES FOUND ---');
    console.log(JSON.stringify(profiles, null, 2));
    
    console.log('--- ROLES FOUND ---');
    console.log(JSON.stringify(userRoles, null, 2));
}

checkUsers();
