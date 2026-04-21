import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
  const email = 'yibrant@internationalcruises.mx';
  
  // Try default password 1
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: 'Traveliz2026!'
  });
  
  if (!error) {
    console.log('Success with password: Traveliz2026!');
    return;
  }
  
  console.log('Failed with Traveliz2026! :', error.message);
  
  // Send reset password email
  const resetRes = await supabase.auth.resetPasswordForEmail(email);
  if (resetRes.error) {
    console.log('Reset email error:', resetRes.error.message);
  } else {
    console.log('Reset email sent successfully to', email);
  }
}

testLogin().catch(console.error);
