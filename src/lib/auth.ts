import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "editor";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading, user: session?.user ?? null };
}

export function useRoles() {
  const { session, loading: sLoading } = useSession();
  const [roles, setRoles] = useState<{ role: Role; section_slug: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sLoading) return;
    if (!session) {
      setRoles([]);
      setLoading(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role, section_slug")
      .eq("user_id", session.user.id)
      .then(({ data }) => {
        setRoles((data as { role: Role; section_slug: string | null }[]) ?? []);
        setLoading(false);
      });
  }, [session, sLoading]);

  const isAdmin = roles.some((r) => r.role === "admin");
  const isEditor = roles.some((r) => r.role === "editor");
  const editorSections = roles.filter((r) => r.role === "editor").map((r) => r.section_slug);
  return { roles, isAdmin, isEditor, editorSections, loading: sLoading || loading, session };
}
