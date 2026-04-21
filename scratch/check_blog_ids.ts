
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listBlogs() {
  const { data, error } = await supabase.from('blog_posts').select('id, title').limit(5);
  if (error) {
    console.error('Error fetching blogs:', error);
    return;
  }
  console.log('Last 5 blogs:');
  data?.forEach(p => console.log(`ID: ${p.id} | Title: ${p.title}`));
}

listBlogs();
