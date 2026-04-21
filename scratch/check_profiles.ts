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
    
    const { data, error } = await supabase.from('profiles').select('email, name').in('email', emails);
    
    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log('--- PROFILES FOUND ---');
        console.log(JSON.stringify(data, null, 2));
    }
}

checkUsers();
