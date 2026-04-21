# Roadmap Go-Live (24 de Abril)

### Fase 1: Desarrollo de Ajustes Críticos
- [x] **1. Blogs:** Automatizar que el autor del blog sea asignado al usuario en sesión.
- [x] **12. Fetch Zoho Proveedores:** Implementar llamado dinámico, caché estática diaria, filtros por región y persistencia de búsqueda. 🚀 (Completado 20 Abr)
- [x] **2. Roles / Accesos (Back-end):** Reforzar que cada tipo de usuario solo acceda a su información (Backend y UI).
- [x] **4. Top Producers (Backend & Frontend):** Lógica y diseño para 3 rangos (Senior, Junior, Associates).
- [x] **5. Auditoría en Admin Backend:** 
    - [x] Actualizar `getAuditLogsPaged` en `api.ts` para soportar filtros por tipo de acción
    - [x] Implementar selector de "Tipo de Acción" en la UI de AuditPanel
    - [x] Implementar lógica de expansión de filas para ver Metadatos (JSON formateado)
    - [x] Implementar botón de exportación a CSV
    - [x] Añadir filtro por rango de fechas (opcional para mayor precisión)
    - [x] Verificar funcionamiento con datos reales de la base de datos
- [x] **19. Notificaciones Push e Email:** Habilitar envío de alertas directas a usuarios (desde admin) integrando un disparador para que también llegue notificación a su buzón de correo.
- [x] **20. Bloqueo Botón Atrás:** Evitar que el navegador salga de la app al usar el botón físico de retroceso.
- [ ] **13. Open Graph Blogs:** Insertar Meta-tags dinámicos para que los blogs muestren imágenes y títulos ricos al compartirse.

### Fase 2: Mobile y Estabilización
- [ ] **3. Bugs Pendientes:** Identificar y parchar errores de la versión actual.
- [x] **18. Bug Fix: Avisos:** Reparar el error de "Aviso no encontrado" al clickear desde la página principal.
- [x] **17. UI Móvil:** Asegurar que formularios y tablas complejas no se rompan y sean 100% responsivas para celulares.
- [ ] **7. Prototipo Funcional Desarrollo:** Pruebas "End-to-End" en entorno dev.

### Fase 3: Seguridad y Bases de Datos
- [ ] **8. Permisos Supabase (RLS):** Bloquear accesos a tablas sin autenticación.
- [ ] **14. SMTP Propio:** Configurar envío de correos (magic-links/recuperaciones) directo desde correo propio en Auth Supabase.
- [ ] **15. Sentry Logs:** Configurar capa de rastreo de errores remotos en JS.
- [ ] **16. Seguridad CORS:** Configurar Supabase para rechazar peticiones que no vengan del subdominio de producción.

### Fase 4: QA (Calidad)
- [ ] **6. Agentes Automatizados:** Generar sub-agentes para ejecutar pruebas sintéticas.

### Fase 5: Producción & Cloud Infraestructura
- [ ] **9. Entorno Producción:** Triggers en GCP Cloud Build hacia `main` + Cloud Run "Production".
- [ ] **10. Apuntar Subdominio:** Domain Mapping / Registros DNS hacia producción.

### Fase 6: Capacitación y Cierre
- [ ] **11. Capacitación:** Guías finales o despliegue manual en entorno real con el equipo base.
