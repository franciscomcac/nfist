CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION app_private.can_edit_section(_user_id uuid, _section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = 'admin'
        OR (
          role = 'editor'
          AND (section_slug IS NULL OR section_slug = _section)
        )
      )
  )
$$;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT USAGE ON SCHEMA app_private TO service_role;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION app_private.can_edit_section(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.can_edit_section(uuid, text) TO service_role;

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "events editor delete" ON public.events;
CREATE POLICY "events editor delete"
ON public.events
FOR DELETE
TO authenticated
USING (app_private.can_edit_section(auth.uid(), section_slug));

DROP POLICY IF EXISTS "events editor insert" ON public.events;
CREATE POLICY "events editor insert"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (app_private.can_edit_section(auth.uid(), section_slug));

DROP POLICY IF EXISTS "events editor update" ON public.events;
CREATE POLICY "events editor update"
ON public.events
FOR UPDATE
TO authenticated
USING (app_private.can_edit_section(auth.uid(), section_slug))
WITH CHECK (app_private.can_edit_section(auth.uid(), section_slug));

DROP POLICY IF EXISTS "repo editor delete" ON public.repository_items;
CREATE POLICY "repo editor delete"
ON public.repository_items
FOR DELETE
TO authenticated
USING (app_private.can_edit_section(auth.uid(), section_slug));

DROP POLICY IF EXISTS "repo editor insert" ON public.repository_items;
CREATE POLICY "repo editor insert"
ON public.repository_items
FOR INSERT
TO authenticated
WITH CHECK (app_private.can_edit_section(auth.uid(), section_slug));

DROP POLICY IF EXISTS "repo editor update" ON public.repository_items;
CREATE POLICY "repo editor update"
ON public.repository_items
FOR UPDATE
TO authenticated
USING (app_private.can_edit_section(auth.uid(), section_slug))
WITH CHECK (app_private.can_edit_section(auth.uid(), section_slug));

DROP POLICY IF EXISTS "sections admin delete" ON public.sections;
CREATE POLICY "sections admin delete"
ON public.sections
FOR DELETE
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "sections admin insert" ON public.sections;
CREATE POLICY "sections admin insert"
ON public.sections
FOR INSERT
TO authenticated
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "sections editor update" ON public.sections;
CREATE POLICY "sections editor update"
ON public.sections
FOR UPDATE
TO authenticated
USING (app_private.can_edit_section(auth.uid(), slug))
WITH CHECK (app_private.can_edit_section(auth.uid(), slug));

DROP POLICY IF EXISTS "settings admin write" ON public.site_settings;
CREATE POLICY "settings admin write"
ON public.site_settings
FOR ALL
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_edit_section(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_edit_section(uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.can_edit_section(uuid, text) FROM anon;