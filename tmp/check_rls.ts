import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRLS() {
  await supabase.auth.signOut();
  await supabase.auth.signInWithPassword({
    email: 'marcelo@traveliz.mx',
    password: 'Traveliz2026!'
  });

  const { data: { user } } = await supabase.auth.getUser();
  console.log("Logged in AS:", user?.id);

  const { data: urData, error: urErr } = await supabase.from('user_roles').select('*').eq('user_id', user?.id);
  console.log("user_roles (authenticated):", urData?.length, urErr?.message);

  const { data: rolesData, error: rErr } = await supabase.from('roles').select('*');
  console.log("roles (authenticated):", rolesData?.length, rErr?.message);
}

testRLS();
