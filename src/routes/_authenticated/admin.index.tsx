import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const [counts, setCounts] = useState<{ eventos: number; repo: number; seccoes: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [e, r, s] = await Promise.all([
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("repository_items").select("*", { count: "exact", head: true }),
        supabase.from("sections").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ eventos: e.count ?? 0, repo: r.count ?? 0, seccoes: s.count ?? 0 });
    })();
  }, []);

  const cards = [
    { to: "/admin/eventos", label: "Eventos", count: counts?.eventos, hint: "Programa institucional e eventos recorrentes." },
    { to: "/admin/repositorio", label: "Repositório", count: counts?.repo, hint: "PDFs, revistas, apontamentos, vídeos." },
    { to: "/admin/seccoes", label: "Secções", count: counts?.seccoes, hint: "Textos institucionais de cada secção." },
  ] as const;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Painel</p>
      <h1 className="font-serif text-4xl mt-2 mb-8">Gestão de conteúdo</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="block border border-hairline p-6 hover:bg-foreground/5 transition-colors">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</p>
            <p className="font-serif text-3xl mt-3">{c.count ?? "—"}</p>
            <p className="text-sm text-muted-foreground mt-2">{c.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
