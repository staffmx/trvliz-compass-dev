# Skill: Post-Deployment Sanity Check (Traveliz Compass)

Este skill realiza una verificación rápida de salud del sitio en producción para asegurar que el despliegue fue exitoso y los componentes críticos están funcionando.

## Requisitos
- URL de producción: `https://traveliz-compass-dev.run.app` (o la URL que proporciones).
- Credenciales de prueba (opcional si la página es pública).

## Instrucciones para el Agente

1. **Verificación de Conectividad**:
   - Navega a la URL de producción.
   - Confirma que el título de la página sea "Traveliz Compass".
   - Verifica que no haya una pantalla en blanco o error 500.

2. **Verificación de UI Premium**:
   - Revisa que el logo de Traveliz cargue correctamente.
   - Verifica que el video de la portada (ID: `UlORnWguPqk`) esté presente en el DOM.
   - Asegúrate de que las fuentes Serif y Sans se estén aplicando correctamente.

3. **Verificación de Secciones Críticas**:
   - Navega a la sección de "Inspiración" (si es accesible).
   - Verifica que al menos un artículo del blog sea visible.
   - Revisa la consola del navegador en busca de errores rojos (Error 404, Failed to fetch, etc.).

4. **Reporte Final**:
   - Si todo está correcto, responde: "✅ Sanity Check Exitoso: Producción estable y visualmente correcta."
   - Si hay errores, lista los selectores fallidos o los mensajes de consola.

---
*Creado por Antigravity para Traveliz Compass v1.0.0*
