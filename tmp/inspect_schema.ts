
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectSchema() {
  const tables = ['associates', 'profiles', 'user_roles', 'notices', 'events', 'search_logs'];
  
  for (const table of tables) {
    console.log(`\n--- Table: ${table} ---`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      continue;
    }
    if (data && data.length > 0) {
      console.log("Sample keys:", Object.keys(data[0]));
      // Try to determine types by value
      for (const [key, value] of Object.entries(data[0])) {
          console.log(`  ${key}: ${typeof value} (Value: ${JSON.stringify(value)})`);
      }
    } else {
      console.log("No data found to inspect columns.");
    }
  }
}

inspectSchema();
