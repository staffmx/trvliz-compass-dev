-- MASTER SECURITY SCRIPT: RLS BLINDAJE PARA TRAVELIZ COMPASS
-- FECHA: 21 ABRIL 2026

-- 1. FUNCIONES AUXILIARES DE SEGURIDAD (Security Definer para evitar recursión)
CREATE OR REPLACE FUNCTION public.check_user_is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_user_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'admin' OR r.name = 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_user_is_editor_blogs()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'admin' OR r.name = 'super_admin' OR r.name = 'editor_blogs')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. ACTIVACIÓN DE RLS EN TODAS LAS TABLAS
ALTER TABLE public.associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recorded_webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 3. LIMPIEZA DE POLÍTICAS EXISTENTES (Para asegurar un estado limpio)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;


-- 4. DEFINICIÓN DE NUEVAS POLÍTICAS

--- BLOG POSTS (Público)
CREATE POLICY "Lectura pública de blogs" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Gestión de blogs para editores/admins" ON public.blog_posts ALL TO authenticated 
USING (public.check_user_is_editor_blogs()) WITH CHECK (public.check_user_is_editor_blogs());

--- BLOG COMMENTS (Semipúblico)
CREATE POLICY "Lectura pública de comentarios" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Insertar comentarios para logueados" ON public.blog_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Moderación de comentarios para admins" ON public.blog_comments ALL TO authenticated 
USING (public.check_user_is_admin()) WITH CHECK (public.check_user_is_admin());

--- AUDIT LOGS (Admin y SuperAdmin solamente)
CREATE POLICY "Lectura de logs para admins" ON public.audit_logs FOR SELECT TO authenticated USING (public.check_user_is_admin());
CREATE POLICY "Loggear es automático para todos" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

--- USER ROLES & ROLES (SuperAdmin solamente)
CREATE POLICY "Gestión de roles para SuperAdmins" ON public.user_roles ALL TO authenticated USING (public.check_user_is_superadmin()) WITH CHECK (public.check_user_is_superadmin());
CREATE POLICY "Lectura de catálogo de roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Gestión de catálogo de roles para SuperAdmins" ON public.roles ALL TO authenticated USING (public.check_user_is_superadmin()) WITH CHECK (public.check_user_is_superadmin());

--- SELLERS (Top Producers)
CREATE POLICY "Lectura de rankings para logueados" ON public.sellers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Gestión de rankings para admins" ON public.sellers ALL TO authenticated 
USING (public.check_user_is_admin()) WITH CHECK (public.check_user_is_admin());

--- PROFILES 
CREATE POLICY "Lectura de perfiles para logueados" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auto-gestión de perfil propio" ON public.profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin gestión de todos los perfiles" ON public.profiles ALL TO authenticated 
USING (public.check_user_is_admin()) WITH CHECK (public.check_user_is_admin());

--- TABLAS GENERALES DE LECTURA AGENTE (Associates, Notices, Events, Webinars, Certs, Docs)
-- Definimos una política común: Lectura para AUTH, Gestión para ADMIN.
DO $$ 
DECLARE 
    t TEXT;
    target_tables TEXT[] := ARRAY['associates', 'notices', 'events', 'recorded_webinars', 'certifications', 'documents'];
BEGIN
    FOREACH t IN ARRAY target_tables LOOP
        EXECUTE 'CREATE POLICY "Lectura para logueados" ON public.' || quote_ident(t) || ' FOR SELECT TO authenticated USING (true)';
        EXECUTE 'CREATE POLICY "Gestión para admins" ON public.' || quote_ident(t) || ' ALL TO authenticated USING (public.check_user_is_admin()) WITH CHECK (public.check_user_is_admin())';
    END LOOP;
END $$;

-- 5. VERIFICACIÓN FINAL: Denegar todo acceso anónimo por defecto (Excepto lo ya permitido)
-- Postgres por defecto deniega si RLS está activo y no hay políticas que permitan.
