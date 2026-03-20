# API Proveedores - Guia para Frontend

## URL del JSON

```
https://creatorapp.zohopublic.com/icmxapps/desarrollo-traveliz-ave/json/ListProveedoresAPI/pKVYCQVQMzxJzeTCatXVUv1EvMGMbvAx0n77VrHuduFuWEqVdxAO71nkweWfj6hmR9ryaPNRRmAT9n9ePMrB06mbdTDjrSSunNxJ
```

- **Metodo:** GET
- **Autenticacion:** Ninguna (es publica)
- **Formato:** JSON
- **Total de registros:** 1,754+ proveedores (crece con el tiempo)

---

## Estructura del JSON

El JSON tiene esta forma:

```json
{
  "ListProveedoresAPI": [
    {
      "ID": "3997919000009941019",
      "proProveedor": "Royal Caribbean International",
      "proTipoProveMulti": "Directo",
      "provServicios": "Crucero",
      "ddlPlataforma": "IC,WTH",
      "ddlTipoIngresoCom": "",
      "strContactoGral": "",
      "strPaginaWeb": "",
      "strComoCotizo": "",
      "strFormaPagoProveedor": "",
      "proCorreo": "",
      "proTelefono": "",
      "strBandera": "",
      "strDescripcion_General": "",
      "ddlEstatus": "Inactivo",
      "subComisionForm.ddlPlataforma": "",
      "subUbicacionesForm.ddlProvContinente": "",
      "subContactosForm.contProvNombre": ""
    }
  ]
}
```

---

## Campos del Proveedor (datos principales)

| Campo en JSON            | Descripcion                 | Tipo                                      | Ejemplo                               |
| ------------------------ | --------------------------- | ----------------------------------------- | ------------------------------------- |
| `ID`                     | ID unico del proveedor      | String                                    | "3997919000009941019"                 |
| `proProveedor`           | Nombre del proveedor        | String                                    | "Royal Caribbean International"       |
| `proTipoProveMulti`      | Tipo de proveedor           | String (separado por comas si hay varios) | "Directo" o "Directo,DMC/Proveedor"   |
| `provServicios`          | Servicios que ofrece        | String (separado por comas si hay varios) | "Crucero" o "Experiencias,Hotel,Tour" |
| `ddlPlataforma`          | Plataforma                  | String (separado por comas si hay varios) | "IC,WTH"                              |
| `ddlTipoIngresoCom`      | Tipo de ingreso de comision | String                                    | "Comision sobre tarifa"               |
| `strContactoGral`        | Contacto general            | String                                    | "Juan Perez"                          |
| `strPaginaWeb`           | Pagina web                  | String                                    | "https://www.ejemplo.com"             |
| `strComoCotizo`          | Como se cotiza              | String                                    | "Portal agentes"                      |
| `strFormaPagoProveedor`  | Forma de pago               | String                                    | "Transferencia"                       |
| `proCorreo`              | Correo electronico          | String                                    | "contacto@ejemplo.com"                |
| `proTelefono`            | Telefono                    | String                                    | "+52 555 1234567"                     |
| `strBandera`             | Bandera/Advertencia         | String                                    | "SI" o "NO"                           |
| `strDescripcion_General` | Descripcion general         | String                                    | "Linea de cruceros premium"           |
| `ddlEstatus`             | Estatus                     | String                                    | "Activo" o "Inactivo"                 |

### Campos con valores multiples

Los campos `proTipoProveMulti`, `provServicios` y `ddlPlataforma` pueden tener multiples valores separados por **coma**. Para convertirlos a array:

```javascript
const servicios = proveedor.provServicios ? proveedor.provServicios.split(',').map((s) => s.trim()) : [];
// ["Experiencias", "Hotel", "Tour"]
```

---

## Subformularios (datos anidados)

Los subformularios vienen como **un solo campo de texto** con los datos separados por `|#|`. Cada proveedor puede tener 0, 1 o multiples registros en cada subformulario.

### DatosComision

**Campo en JSON:** `subComisionForm.ddlPlataforma`

**Campos en orden (separados por `|#|`):**

| Posicion | Campo               | Tipo                                | Ejemplo             |
| -------- | ------------------- | ----------------------------------- | ------------------- |
| 1        | Plataforma          | String                              | "IC"                |
| 2        | Clasifica           | String (puede tener comas internas) | "General, Por Pais" |
| 3        | Moneda              | String (abreviacion)                | "MXN"               |
| 4        | Region              | String                              | "Riviera Mexicana"  |
| 5        | Continente          | String                              | "America"           |
| 6        | Pais                | String                              | "Mexico"            |
| 7        | Cabina              | String                              | "Haven"             |
| 8        | Servicio            | String                              | "Crucero"           |
| 9        | Comision Porcentaje | Numero (string)                     | "12.00"             |
| 10       | Comision Monto      | Numero (string)                     | "1200.00"           |

**Ejemplo con 1 comision:**

```
IC |#|General, Por Pais |#|MXN |#|Riviera Mexicana |#|America |#|Mexico |#|Haven |#|Crucero |#|12.00 |#|1200.00
```

**Ejemplo con 2 comisiones (separadas por coma entre el ultimo campo de una y el primero de la siguiente):**

```
WTH |#|General, Por Region |#|AUD |#|Africa Central |#|Antartida |#|Alemania |#|Haven |#|Experiencias |#|19.00 |#|1900.00,Italy Brezee |#|General, Por Cabina |#|CZK |#|Alaska |#|Oceania |#|Azerbaiyan |#|Haven |#|Visas y Documentos |#|29.00 |#|2900.00
```

### DatosUbicacion

**Campo en JSON:** `subUbicacionesForm.ddlProvContinente`

**Campos en orden (separados por `|#|`):**

| Posicion | Campo        | Tipo   | Ejemplo     |
| -------- | ------------ | ------ | ----------- |
| 1        | Continente   | String | "Europa"    |
| 2        | Pais         | String | "Mexico"    |
| 3        | Ciudad       | String | "Cancun"    |
| 4        | Categoria    | String | "Playa"     |
| 5        | Serendipians | String | "SI" o "NO" |

### DatosContactos

**Campo en JSON:** `subContactosForm.contProvNombre`

**Campos en orden (separados por `|#|`):**

| Posicion | Campo             | Tipo   | Ejemplo             |
| -------- | ----------------- | ------ | ------------------- |
| 1        | Nombre            | String | "Juan Perez"        |
| 2        | Correo            | String | "juan@ejemplo.com"  |
| 3        | Correo Secundario | String | "juan2@ejemplo.com" |
| 4        | Telefono          | String | "+52 555 1234567"   |

---

## Como parsear los subformularios

La logica es la misma para los 3 subforms. Cada subform tiene un numero fijo de campos:

- **Comision:** 10 campos
- **Ubicacion:** 5 campos
- **Contactos:** 4 campos

### Parser en JavaScript

```javascript
/**
 * Parsea un campo de subformulario de Zoho Creator
 * @param {string} raw - El string crudo del campo
 * @param {string[]} fieldNames - Nombres de los campos en orden
 * @returns {Object[]} Array de objetos parseados
 */
function parseSubform(raw, fieldNames) {
  if (!raw || raw.trim() === '') return [];

  const numFields = fieldNames.length;
  const parts = raw.split(' |#|');
  const records = [];
  let current = {};
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

  return records;
}

// Definicion de campos por subform
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
```

### Ejemplo completo de uso

```javascript
const URL_API =
  'https://creatorapp.zohopublic.com/icmxapps/desarrollo-traveliz-ave/json/ListProveedoresAPI/pKVYCQVQMzxJzeTCatXVUv1EvMGMbvAx0n77VrHuduFuWEqVdxAO71nkweWfj6hmR9ryaPNRRmAT9n9ePMrB06mbdTDjrSSunNxJ';

async function obtenerProveedores() {
  const response = await fetch(URL_API);
  const data = await response.json();
  const proveedoresRaw = data.ListProveedoresAPI;

  const proveedores = proveedoresRaw.map((p) => ({
    id: p.ID,
    nombre: p.proProveedor,
    tipoProveedor: p.proTipoProveMulti ? p.proTipoProveMulti.split(',').map((s) => s.trim()) : [],
    servicios: p.provServicios ? p.provServicios.split(',').map((s) => s.trim()) : [],
    plataforma: p.ddlPlataforma ? p.ddlPlataforma.split(',').map((s) => s.trim()) : [],
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

    // Subformularios parseados
    comisiones: parseSubform(p['subComisionForm.ddlPlataforma'], COMISION_FIELDS),
    ubicaciones: parseSubform(p['subUbicacionesForm.ddlProvContinente'], UBICACION_FIELDS),
    contactos: parseSubform(p['subContactosForm.contProvNombre'], CONTACTO_FIELDS),
  }));

  return proveedores;
}

// Uso
obtenerProveedores().then((proveedores) => {
  console.log(`Total proveedores: ${proveedores.length}`);

  // Ejemplo: filtrar activos
  const activos = proveedores.filter((p) => p.estatus === 'Activo');

  // Ejemplo: buscar por nombre
  const resultado = proveedores.filter((p) => p.nombre.toLowerCase().includes('royal'));

  // Ejemplo: ver comisiones de un proveedor
  console.log(proveedores[0].comisiones);
  // [{ Plataforma: "IC", Clasifica: "General, Por Pais", Moneda: "MXN", ... }]
});
```

### Resultado despues de parsear (ejemplo)

```json
{
  "id": "3997919000009888007",
  "nombre": "Westin Copley Place Boston",
  "tipoProveedor": ["Directo"],
  "servicios": ["Hotel"],
  "plataforma": ["IC", "WTH"],
  "tipoIngreso": "",
  "contactoGeneral": "",
  "paginaWeb": "",
  "comoCotizo": "",
  "formaPago": "",
  "correo": "",
  "telefono": "",
  "bandera": "",
  "descripcion": "",
  "estatus": "Inactivo",
  "comisiones": [
    {
      "Plataforma": "IC",
      "Clasifica": "General, Por Pais",
      "Moneda": "MXN",
      "Region": "Riviera Mexicana",
      "Continente": "America",
      "Pais": "Mexico",
      "Cabina": "Haven",
      "Servicio": "Crucero",
      "Porcentaje": "12.00",
      "Monto": "1200.00"
    }
  ],
  "ubicaciones": [],
  "contactos": []
}
```

---

## Notas importantes

1. **El JSON se descarga como archivo** — no se muestra en el navegador. El fetch lo maneja normal.
2. **Encoding:** Algunos caracteres especiales (acentos como "America", "Africa") pueden venir con encoding incorrecto. Asegurate de manejar UTF-8 en el fetch.
3. **Campos vacios:** Si un proveedor no tiene comisiones/ubicaciones/contactos, el campo viene como string vacio `""`. El parser retorna un array vacio `[]`.
4. **Los IDs son strings**, no numeros.
5. **Clasifica en Comision** puede contener comas internas (ej: "General, Por Region, Por Pais"). Eso NO es un separador de valores, es parte del mismo campo.
6. **El JSON contiene 1,754+ proveedores** y va a seguir creciendo. Consideren paginacion o filtrado en el frontend.
