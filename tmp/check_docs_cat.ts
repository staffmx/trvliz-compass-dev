import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    let t = 'documents_categoria';
    let res = await supabase.from(t).select('*').limit(1);
    
    if(res.error) { 
        t = 'documents_categorias'; 
        res = await supabase.from(t).select('*').limit(1); 
    }
    if(res.error) { 
        t = 'document_categories'; 
        res = await supabase.from(t).select('*').limit(1); 
    }
    
    console.log("Found table:", t);
    console.log("Columns:", res.data && res.data.length > 0 ? Object.keys(res.data[0]) : "No data to infer columns");
    
    // Si no hay datos, tratamos de insertar algo e imprimir el error para ver columnas
    if (!res.data || res.data.length === 0) {
        const insertRes = await supabase.from(t).insert({ ID_BOGUS: 1 }).select();
        console.log("Insert Error (to reveal schema):", insertRes.error?.message);
    }
}
check();
