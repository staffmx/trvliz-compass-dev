import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testMarcelo() {
  console.log("Signing in as marcelo@traveliz.mx...");
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'marcelo@traveliz.mx',
    password: 'Traveliz2026!'
  });

  if (authErr) {
    console.error("Auth Error:", authErr.message);
    return;
  }
  console.log("Auth Success. UID:", authData.user?.id);

  console.log("Checking profiles table...");
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user?.id!);

  console.log("Raw Profile Data:", JSON.stringify(profile, null, 2));
  console.log("Raw Profile Error:", profErr?.message);
}

testMarcelo();
