REVOKE ALL ON public.events FROM anon;
GRANT SELECT ON public.events TO anon;

REVOKE ALL ON public.repository_items FROM anon;
GRANT SELECT ON public.repository_items TO anon;

REVOKE ALL ON public.sections FROM anon;
GRANT SELECT ON public.sections TO anon;

REVOKE ALL ON public.site_settings FROM anon;
GRANT SELECT ON public.site_settings TO anon;

REVOKE ALL ON public.user_roles FROM anon;