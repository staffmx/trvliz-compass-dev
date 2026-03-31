import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testUpload() {
  console.log('Testing upload to travel_advisors bucket...');
  try {
    const dummyContent = 'dummy image content';
    // Using string as body just to test bucket access
    const { data, error } = await supabase.storage
      .from('travel_advisors')
      .upload('test_upload.txt', dummyContent, {
        contentType: 'text/plain',
        upsert: true
      });

    if (error) {
      console.error('Upload Error:', JSON.stringify(error, null, 2));
    } else {
      console.log('Upload success:', data);
    }
  } catch (e: any) {
    console.error('Caught Exception:', e.message);
  }
}

testUpload();
