import * as fs from 'fs';
import * as path from 'path';

function parseSubform(raw: string | undefined | null, fieldNames: string[]): any[] {
  if (!raw || raw.trim() === '') return [];
  const numFields = fieldNames.length;
  const parts = raw.split(' |#|');
  const records: any[] = [];
  let current: any = {};
  let fieldIndex = 0;

  for (let i = 0; i < parts.length; i++) {
    let value = parts[i].trim();
    if (fieldIndex === 0 && i > 0) {
      const commaIndex = value.lastIndexOf(',');
      if (commaIndex !== -1) {
        value = value.substring(commaIndex + 1).trim();
      }
    }
    current[fieldNames[fieldIndex]] = value;
    fieldIndex++;

    if (fieldIndex === numFields) {
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

const COMISION_FIELDS = ['Plataforma', 'Clasifica', 'Moneda', 'Region', 'Continente', 'Pais', 'Cabina', 'Servicio', 'Porcentaje', 'Monto'];
const UBICACION_FIELDS = ['Continente', 'Pais', 'Ciudad', 'Categoria', 'Serendipians'];
const CONTACTO_FIELDS = ['Nombre', 'Correo', 'CorreoSec', 'Telefono'];

try {
  const fileContent = fs.readFileSync(path.join(process.cwd(), 'public/ListProveedoresAPI.json'), 'utf-8');
  const data = JSON.parse(fileContent);
  const proveedoresRaw = data.ListProveedoresAPI || [];
  
  console.log(`Found ${proveedoresRaw.length} raw providers.`);
  
  let successCount = 0;
  
  const proveedores = proveedoresRaw.map((p: any) => {
    try {
      const mapped = {
        id: p.ID,
        nombre: p.proProveedor || '',
        tipoProveedor: p.proTipoProveMulti ? p.proTipoProveMulti.toString().split(',').map((s: string) => s.trim()) : [],
        servicios: p.provServicios ? p.provServicios.toString().split(',').map((s: string) => s.trim()) : [],
        plataforma: p.ddlPlataforma ? p.ddlPlataforma.toString().split(',').map((s: string) => s.trim()) : [],
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
        comisiones: parseSubform(p['subComisionForm.ddlPlataforma'], COMISION_FIELDS),
        ubicaciones: parseSubform(p['subUbicacionesForm.ddlProvContinente'], UBICACION_FIELDS),
        contactos: parseSubform(p['subContactosForm.contProvNombre'], CONTACTO_FIELDS),
      };
      successCount++;
      return mapped;
    } catch (e: any) {
        console.error(`Error mapping provider ${p.ID} (${p.proProveedor}):`, e.message);
        return null;
    }
  }).filter(Boolean);
  
  console.log(`Successfully mapped ${successCount} providers.`);
  
} catch (e) {
  console.error("Failed to parse JSON file", e);
}
