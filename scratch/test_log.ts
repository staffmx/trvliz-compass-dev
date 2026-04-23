
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testInsert() {
  console.log("Intentando insertar log de prueba...");
  const { data, error } = await supabase.from('search_logs').insert({
    user_id: 'df355115-593d-4bf6-a47e-c2ccc9977e2d', // ID de Karla para probar
    user_name: 'TEST USER',
    query: 'PRUEBA SISTEMA',
    results_count: 5
  }).select();

  if (error) {
    console.error("ERROR AL INSERTAR:", error);
  } else {
    console.log("¡ÉXITO! Registro insertado:", data);
  }
}

testInsert();
