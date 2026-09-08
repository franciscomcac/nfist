GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon;
GRANT ALL ON public.events TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.repository_items TO authenticated;
GRANT SELECT ON public.repository_items TO anon;
GRANT ALL ON public.repository_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sections TO authenticated;
GRANT SELECT ON public.sections TO anon;
GRANT ALL ON public.sections TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT SELECT ON public.site_settings TO anon;
GRANT ALL ON public.site_settings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;