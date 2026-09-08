import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/lib/auth";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — NFIST" }, { name: "robots", content: "noindex" }] }),
});

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isEditor, loading, session } = useRoles();

  useEffect(() => {
    if (!loading && session && !isAdmin && !isEditor) {
      // Signed in but no roles yet — show notice, don't redirect
    }
  }, [loading, session, isAdmin, isEditor]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function retryPermissions() {
    window.location.reload();
  }

  const nav: { to: string; label: string; end?: boolean }[] = [
    { to: "/admin", label: "Início", end: true },
    { to: "/admin/eventos", label: "Eventos" },
    { to: "/admin/repositorio", label: "Repositório" },
    { to: "/admin/seccoes", label: "Secções" },
    ...(isAdmin ? [{ to: "/admin/utilizadores", label: "Utilizadores" }] : []),
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 border-b border-hairline bg-background/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">NFIST</p>
            <p className="font-serif text-base leading-tight">Painel</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Site</Link>
            <button onClick={signOut} className="inline-flex items-center gap-1 hover:text-foreground">
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 text-sm no-scrollbar" data-lenis-prevent>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={n.end ? { exact: true } : undefined}
              activeProps={{ className: "bg-foreground/10 text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex border-r border-hairline bg-background/60 px-6 py-5 lg:sticky lg:top-0 lg:h-screen flex-col">
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">NFIST</p>
          <p className="font-serif text-xl mt-1">Painel</p>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={n.end ? { exact: true } : undefined}
              activeProps={{ className: "bg-foreground/5 text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="px-3 py-2 rounded-sm transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-2 text-xs text-muted-foreground">
          <p className="truncate">{session?.user.email}</p>
          <p>{isAdmin ? "Admin" : isEditor ? "Editor" : "Sem permissões"}</p>
          <div className="flex flex-col gap-1 pt-1">
            <Link to="/" className="hover:text-foreground">← Ver site</Link>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 hover:text-foreground text-left">
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
      </aside>

      <main className="p-4 sm:p-6 lg:p-12 max-w-5xl w-full">
        {!loading && !isAdmin && !isEditor ? (
          <div className="border border-hairline p-6 sm:p-8 bg-background/60">
            <h1 className="font-serif text-2xl mb-3">Conta sem permissões</h1>
            <p className="text-sm text-muted-foreground">
              A tua conta está autenticada mas ainda não tem permissões atribuídas. Contacta um administrador para receber acesso.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={retryPermissions}
                className="border border-hairline px-4 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                Tentar novamente
              </button>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center justify-center gap-2 border border-hairline px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
