GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

GRANT EXECUTE ON FUNCTION public.can_edit_section(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_section(uuid, text) TO service_role;