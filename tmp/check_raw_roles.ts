import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkRoles() {
  const uid = '9e658037-af70-4855-8681-60da2aaa5d9b';
  console.log("Checking user_roles raw for", uid);
  
  // No auth, just anon key
  const { data, error } = await supabase.from('user_roles').select('*').eq('user_id', uid);
  console.log("Raw user_roles:", data);
  console.log("Raw error:", error);
}
checkRoles();
