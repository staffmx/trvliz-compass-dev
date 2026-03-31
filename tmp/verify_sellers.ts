
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSellersSchema() {
  const { data, error } = await supabase.from('sellers').select('*').limit(1);
  if (error) {
    console.error("Error fetching sellers:", error);
    return;
  }
  if (data && data.length > 0) {
    console.log("Seller columns:", Object.keys(data[0]));
  } else {
    // Try to get columns even if empty
    const { data: cols, error: err2 } = await supabase.rpc('get_table_columns', { table_name: 'sellers' });
    if (err2) console.log("Could not get columns via RPC, table might be empty.");
    else console.log("Sellers columns (RPC):", cols);
  }
}

checkSellersSchema();
