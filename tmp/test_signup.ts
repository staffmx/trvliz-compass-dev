import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSignUp() {
  const email = `testuser_${Date.now()}@example.com`;
  const tempPassword = "Traveliz2026!"; 
  
  console.log(`Attempting to sign up ${email}`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: tempPassword,
    options: {
      data: {
        full_name: 'Test User',
      }
    }
  });

  if (error) {
    console.error("SignUp Error:", error);
  } else {
    console.log("SignUp Success data:", JSON.stringify(data, null, 2));
    
    console.log("Attempting to sign in with new credentials...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: tempPassword
    });
    
    if (signInError) {
        console.error("SignIn Error:", signInError);
    } else {
        console.log("SignIn Success!");
    }
  }
}

testSignUp().catch(console.error);
