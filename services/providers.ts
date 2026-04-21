import { Provider, ProviderCommission, ProviderLocation, ProviderContact } from '../types';

/**
 * Parsea un campo de subformulario de Zoho Creator
 * @param raw - El string crudo del campo
 * @param fieldNames - Nombres de los campos en orden
 * @returns Array de objetos parseados
 */
function parseSubform(raw: string | undefined | null, fieldNames: string[]): any[] {
  if (!raw || raw.trim() === '') return [];

  const numFields = fieldNames.length;
  const parts = raw.split(' |#|');
  const records: any[] = [];
  let current: any = {};
  let fieldIndex = 0;

  for (let i = 0; i < parts.length; i++) {
    let value = parts[i].trim();

    // Si es el primer campo y contiene coma, puede ser separador de registros
    // El ultimo valor del registro anterior esta pegado con coma al primer valor del siguiente
    if (fieldIndex === 0 && i > 0) {
      const commaIndex = value.lastIndexOf(',');
      if (commaIndex !== -1) {
        // Antes de la coma: ultimo valor del registro anterior (no aplica al primer registro)
        // Despues de la coma: primer valor del nuevo registro
        value = value.substring(commaIndex + 1).trim();
      }
    }

    current[fieldNames[fieldIndex]] = value;
    fieldIndex++;

    if (fieldIndex === numFields) {
      // Si el ultimo campo tiene coma, separar el valor real
      const lastField = fieldNames[numFields - 1];
      const lastValue = current[lastField];
      if (lastValue && lastValue.includes(',')) {
        const commaIndex = lastValue.indexOf(',');
        current[lastField] = lastValue.substring(0, commaIndex).trim();
      }
      records.push({ ...current });
      current = {};
      fieldIndex = 0;
    }
  }

  if (Object.keys(current).length > 0) {
    records.push({ ...current });
  }

  return records;
}

const COMISION_FIELDS = [
  'Plataforma',
  'Clasifica',
  'Moneda',
  'Region',
  'Continente',
  'Pais',
  'Cabina',
  'Servicio',
  'Porcentaje',
  'Monto',
];

const UBICACION_FIELDS = ['Continente', 'Pais', 'Ciudad', 'Categoria', 'Serendipians'];

const CONTACTO_FIELDS = ['Nombre', 'Correo', 'CorreoSec', 'Telefono'];

export const providersService = {
  async fetchProviders(): Promise<{ code: number, data: Provider[] }> {
    let data;

    try {
      // 1. Intentar cargar el archivo desde Supabase Storage (Cero tokens de Zoho)
      // El archivo es actualizado diario por una Edge Function
      const STORAGE_URL = 'https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/catalogos/providers.json';
      
      const storageResponse = await fetch(STORAGE_URL);

      if (storageResponse.ok) {
        data = await storageResponse.json();
      } else {
        throw new Error('Archivo en Storage no encontrado');
      }
    } catch (cacheErr) {
      // 2. Fallback: Cargar desde la API de Zoho directamente (Gasta tokens)
      console.warn('⚠️ Cache en Storage fallida, recurriendo a Zoho API directamente...', cacheErr);
      const PROXY_PATH = '/zoho-api';
      const API_ENDPOINT = '/icmxapps/traveliz-ave/json/ListProveedoresAPI/dp5RObAWdKEB4uqDSzUqrx8zR7e9TqFAAQkQCnnPNJbFv06Ty7Awpa2CV8VHFpdC0wBqmgujbs6FQS7nm9a93GUbsk4kgOD08n2W';
      const ZOHO_URL = `${PROXY_PATH}${API_ENDPOINT}`;
      
      const response = await fetch(ZOHO_URL);
      if (!response.ok) {
          throw new Error('Error al conectar con la API de Zoho');
      }
      data = await response.json();
    }

    const proveedoresRaw = data.ListProveedoresAPI || [];

    const proveedores: Provider[] = proveedoresRaw.map((p: any) => ({
      id: p.ID,
      nombre: p.proProveedor || '',
      tipoProveedor: p.proTipoProveMulti ? p.proTipoProveMulti.split(',').map((s: string) => s.trim()) : [],
      servicios: p.provServicios ? p.provServicios.split(',').map((s: string) => s.trim()) : [],
      plataforma: p.ddlPlataforma ? p.ddlPlataforma.split(',').map((s: string) => s.trim()) : [],
      tipoIngreso: p.ddlTipoIngresoCom || '',
      contactoGeneral: p.strContactoGral || '',
      paginaWeb: p.strPaginaWeb || '',
      comoCotizo: p.strComoCotizo || '',
      formaPago: p.strFormaPagoProveedor || '',
      correo: p.proCorreo || '',
      telefono: p.proTelefono || '',
      bandera: p.strBandera || '',
      descripcion: p.strDescripcion_General || '',
      estatus: p.ddlEstatus || '',
  
      comisiones: parseSubform(p['subComisionForm.ddlPlataforma'], COMISION_FIELDS) as ProviderCommission[],
      ubicaciones: parseSubform(p['subUbicacionesForm.ddlProvContinente'], UBICACION_FIELDS) as ProviderLocation[],
      contactos: parseSubform(p['subContactosForm.contProvNombre'], CONTACTO_FIELDS) as ProviderContact[],
    }));

    // Returning simulated code and mapped data backward compatible to how the frontend uses it (expecting a data array)
    return { code: 3000, data: proveedores };
  }
};
