import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type NewUserInput = {
  email: string;
  password: string;
  role: "admin" | "editor";
  section_slug?: string | null;
};

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .limit(1);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Forbidden");
}

export const createAppUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: NewUserInput) => {
    if (!input.email?.includes("@")) throw new Error("Email inválido");
    if (!input.password || input.password.length < 8) throw new Error("Palavra-passe muito curta (mínimo 8 caracteres)");
    if (input.role !== "admin" && input.role !== "editor") throw new Error("Papel inválido");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const userId = created.user!.id;
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: userId,
      role: data.role,
      section_slug: data.role === "editor" && data.section_slug?.trim() ? data.section_slug.trim() : null,
    });
    if (roleError) throw new Error(roleError.message);
    return { userId, email: data.email };
  });

export const deleteAppUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Não podes eliminar-te a ti próprio.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAppUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin.from("user_roles").select("*");
    return users.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      roles: (roles ?? []).filter((r: any) => r.user_id === u.id).map((r: any) => ({
        id: r.id,
        role: r.role as "admin" | "editor",
        section_slug: r.section_slug as string | null,
      })),
    }));
  });

export const bootstrapFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; password: string }) => {
    if (!input.email?.includes("@")) throw new Error("Email inválido");
    if (!input.password || input.password.length < 8) throw new Error("Palavra-passe muito curta (mínimo 8 caracteres)");
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) throw new Error("Configuração inicial já foi feita.");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user!.id, role: "admin" });
    if (roleError) throw new Error(roleError.message);
    return { ok: true };
  });

export const hasAnyAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  return { hasAdmin: (count ?? 0) > 0 };
});
