import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ZOHO_URL = 'https://creatorapp.zohopublic.com/icmxapps/traveliz-ave/json/ListProveedoresAPI/dp5RObAWdKEB4uqDSzUqrx8zR7e9TqFAAQkQCnnPNJbFv06Ty7Awpa2CV8VHFpdC0wBqmgujbs6FQS7nm9a93GUbsk4kgOD08n2W';

serve(async (req) => {
  try {
    console.log('🚀 Iniciando sincronización de Zoho -> Supabase Storage...');

    // 1. Obtener datos de Zoho
    const zohoResponse = await fetch(ZOHO_URL);
    if (!zohoResponse.ok) {
      throw new Error(`Error al conectar con Zoho: ${zohoResponse.statusText}`);
    }
    const data = await zohoResponse.json();

    // 2. Inicializar cliente de Supabase (Admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 3. Subir al Storage (Bucket: 'catalogos', Archivo: 'providers.json')
    // Usamos upsert: true para sobreescribir el archivo existente
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('catalogos')
      .upload('providers.json', JSON.stringify(data), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) throw uploadError;

    console.log('✅ Catálogo sincronizado exitosamente en Storage.');

    return new Response(
      JSON.stringify({ success: true, message: 'Catálogo actualizado' }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Error en la función:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
})
