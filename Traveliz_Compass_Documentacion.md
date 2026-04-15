# Documentación del Sistema: Traveliz Compass

**Traveliz Compass** es una plataforma centralizada y ecosistema digital diseñado exclusivamente para gestionar las interacciones, recursos, herramientas operativas y capacitaciones de los agentes y socios de **Traveliz**.

## 1. Arquitectura y Características Técnicas

El sistema está construido bajo un enfoque de aplicación de página única (SPA) apoyado en una robusta arquitectura sin servidor (*Serverless*) escalable y de alta disponibilidad.

### Stack Tecnológico
*   **Frontend (Interfaz de Usuario):** Desarrollado en **React 19** utilizando **Vite** como empaquetador para garantizar tiempos de carga ultrarrápidos e interactividad fluida.
*   **Backend & Base de Datos:** Administrado mediante **Supabase**, que provee una potente base de datos relacional (PostgreSQL), sistema encriptado de Autenticación Múltiple (Auth) y almacenamiento de activos multimedia (Storage) con reglas estrictas de seguridad por niveles (*Row Level Security*).
*   **Infraestructura de Alojamiento (Hosting):** Desplegado en **Google Cloud Platform (Cloud Run)** bajo contenedores **Docker** y **Nginx**. Esto asegura una plataforma con capacidad de escalar automáticamente ("auto-scaling") que responde instantáneamente sin importar el volumen de usuarios.
*   **Sincronización Dinámica:** Está integrado con un proxy inverso interno seguro para conectar en tiempo real y sin paradas de sincronización con el sistema principal de la empresa a través de la **ZOHO API**, evitando cualquier conflicto de origen (CORS).
*   **Estrategia SEO / Redes Sociales:** Integración dinámica de etiquetas Open Graph y Meta Tags (`react-helmet-async`) para optimizar el aspecto y previsualización gráfica cuando los enlaces internos de la plataforma son compartidos vía WhatsApp, iMessage, LinkedIn y otras redes sociales.

---

## 2. Módulos y Funcionalidades del Ecosistema

La herramienta cuenta con un control estricto de accesos. Las visualizaciones reaccionan y ocultan o muestran sus elementos dependiendo del rol verificado del usuario (p. ej. *Administrador, Agente Autorizado, Elite*, etc).

### A. Módulo de Dashboard y Tablero Principal
Una pantalla principal de bienvenida donde todos los elementos cambian según las novedades de la empresa:
*   **Tablero de Avisos (Notices):** Anuncios de alta prioridad manejados por administración que la fuerza de agentes visualizará en su pantalla de ingreso.
*   **Ranking de Top Producers:** Un área dinámica que segmenta y aplaude públicamente a los mejores asesores (Sellers) mediante jerarquías visuales (*Tiers*).

### B. Directorio de Agentes (Social / B2B)
*   **Perfiles Detallados:** Un directorio interactivo y buscador en tiempo real de todos los agentes.
*   **Tarjetas de Presentación Digitales:** Cada agente tiene acceso a su sección de "Mi Perfil" donde puede vaciar y gestionar su fotografía, descripción profesional, puestos, redes sociales de contacto (WhatsApp, IG, LinkedIn) y listado de especialidades turísticas.

### C. Proveedores y Partnerships
*   Listado categorizado y estructurado de todos los servicios, hoteles, operadores turísticos y empresas afiliadas.
*   Sincronizado de **forma dinámica con el API de integración de la cuenta corporativa Zoho**, permitiendo visualizar directamente en la aplicación a todos los proveedores sin requerir inserciones dobles de bases de datos.
*   Módulo de exploración por nichos y perfiles de contacto en cada tarjeta de proveedor.

### D. Centro de Eventos y Capacitación Continua
Diseñado para llevar el seguimiento educativo de los socios de inicio a fin:
*   **Webinars Grabados:** Un modelo similar a "Netflix" donde los socios acceden a una biblioteca en demanda, categorizada por tipo de capacitación (Cruceros, Terrestres, Destinos específicos, etc.).
*   **Certificaciones Oficiales:** Herramientas de seguimiento para diplomados y evaluaciones expedidas por la agencia.
*   **Mentorías 1:1:** Una herramienta de gestión para reservar acompañamientos estratégicos, donde los agentes solicitan fechas tentativas y exponen su objetivo de la sesión guiada.

### E. Módulo de Eventos Presenciales
*   Gestión de eventos exclusivos. Los eventos validan en la base de datos el progreso y correo del participante.
*   Bloqueos dinámicos en la interfaz que permiten el registro únicamente al cumplir requisitos o mediante cuotas en la nube.

### F. Repositorio de Documentación e Inspiración (Blog)
*   **Archivador Centralizado:** Folders en la nube administrados con permisos para descargar recursos técnicos, manuales y tarifarios.
*   **Noticias e Inspiración (Blog):** Un periódico interno estructurado, con métricas de tiempo de lectura, categorización para motores de búsqueda, con conteo de visualizaciones, sistema de Me Gusta (Likes) y Guardado interactivo en los perfiles de los usuarios.

### G. Panel de Administración ("Backoffice")
Módulo invisible para los usuarios normales, y disponible únicamente para administradores, que elimina la dependencia de un ingeniero de *IT*:
*   Desde un entorno puramente visual, los dueños pueden agregar manuales, crear noticias enteras para el periódico interactivo, borrar/crear usuarios secundarios (Cuentas de Agencia), resetear contraseñas de los usuarios en problemas, subir y editar eventos o webinars, todo a nivel base de datos sin alterar una sola línea de código.
