import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testUser(email: string, pass: string) {
  console.log(`\n--- Testing ${email} ---`);
  await supabase.auth.signOut();
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email, password: pass
  });

  if (authErr) {
    console.error("Auth Error:", authErr.message);
    return;
  }
  console.log("Auth clear. UID:", authData.user?.id);

  const { data, error } = await supabase
    .from('profiles')
    .select(`*, user_roles(roles(name))`)
    .eq('id', authData.user?.id!)
    .maybeSingle();

  console.log("Profile Data:", data ? "SUCCESS (Data loaded)" : "NULL");
  console.log("Error:", error?.message || "None");
}

async function run() {
  await testUser('marcelo@traveliz.mx', 'Traveliz2026!');
  await testUser('yibrant@internationalcruises.mx', 'C11rr7001$'); // Note: guessing pass or it will fail
}
run();
