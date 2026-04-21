import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listUsers() {
  const { data, error } = await supabase.from('profiles').select('email, full_name, created_at, id').order('created_at', { ascending: false }).limit(5);
  
  if (error) {
    console.error("Error fetching profiles:", error);
    return;
  }
  
  console.log("Recent profiles:");
  console.table(data);

  if (data && data.length > 0) {
      console.log(`\nTesting login for recent user: ${data[0].email}`);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data[0].email,
          password: 'Traveliz2026!'
      });
      if (authError) {
          console.error("Login failed:", authError.message);
      } else {
          console.log("Login success for:", authData.user.email);
      }
  }
}

listUsers().catch(console.error);
