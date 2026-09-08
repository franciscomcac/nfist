import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText, Video, BookOpen, FileType2, Newspaper } from "lucide-react";
import { REPOSITORY, type RepoItem } from "@/content/repository";

export const Route = createFileRoute("/repositorio")({
  head: () => ({
    meta: [
      { title: "Repositório de Materiais — NFIST" },
      {
        name: "description",
        content:
          "Biblioteca digital do NFIST: apontamentos MEFT, edições da revista Pulsar, relatórios, vídeos e materiais de divulgação.",
      },
      { property: "og:title", content: "Repositório de Materiais — NFIST" },
      { property: "og:description", content: "Biblioteca digital do NFIST." },
      { property: "og:url", content: "/repositorio" },
    ],
    links: [{ rel: "canonical", href: "/repositorio" }],
  }),
  component: RepoPage,
});

const TYPE_ICONS: Record<RepoItem["type"], any> = {
  PDF: FileText,
  Vídeo: Video,
  Artigo: FileType2,
  Apontamentos: BookOpen,
  Revista: Newspaper,
};

function RepoPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [year, setYear] = useState<string>("all");

  const types = ["all", ...Array.from(new Set(REPOSITORY.map((r) => r.type)))];
  const years = ["all", ...Array.from(new Set(REPOSITORY.map((r) => r.date.slice(0, 4)))).sort((a, b) => b.localeCompare(a))];

  const items = useMemo(
    () =>
      REPOSITORY.filter((r) => {
        if (type !== "all" && r.type !== type) return false;
        if (year !== "all" && !r.date.startsWith(year)) return false;
        if (q && !`${r.title} ${r.author} ${r.topic}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }).sort((a, b) => b.date.localeCompare(a.date)),
    [q, type, year],
  );

  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-6 md:pb-8 border-b border-hairline">
        <div className="eyebrow mb-3">Biblioteca</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl">Repositório de Materiais</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Apontamentos de licenciatura e mestrado em Engenharia Física Tecnológica, edições da
          revista Pulsar, relatórios institucionais e conteúdo multimédia produzido pelas secções.
        </p>
      </header>

      <section className="container-page py-6 md:py-10 grid gap-3 md:gap-4 sm:grid-cols-2 md:grid-cols-[1fr_auto_auto] items-center border-b border-hairline">
        <label className="relative block sm:col-span-2 md:col-span-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por título, autor ou tema…"
            aria-label="Pesquisar no repositório"
            className="w-full bg-transparent border border-hairline pl-9 pr-3 h-11 text-sm focus:outline-none focus:border-foreground/40"
          />
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filtrar por tipo"
          className="bg-transparent border border-hairline h-11 px-3 text-sm focus:outline-none focus:border-foreground/40"
        >
          {types.map((t) => (
            <option key={t} value={t} className="bg-background">
              {t === "all" ? "Todos os tipos" : t}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="Filtrar por ano"
          className="bg-transparent border border-hairline h-11 px-3 text-sm focus:outline-none focus:border-foreground/40"
        >
          {years.map((y) => (
            <option key={y} value={y} className="bg-background">
              {y === "all" ? "Todos os anos" : y}
            </option>
          ))}
        </select>
      </section>

      <section className="container-page py-4 pb-24">
        <div className="font-mono text-xs text-muted-foreground py-4">
          {items.length} {items.length === 1 ? "resultado" : "resultados"}
        </div>
        <ul>
          {items.map((r) => {
            const Icon = TYPE_ICONS[r.type];
            return (
              <li
                key={r.id}
                className="border-t border-hairline last:border-b py-5 grid grid-cols-[24px_minmax(0,1fr)_auto] md:grid-cols-[24px_minmax(0,1fr)_140px_100px_80px] gap-4 items-center hover:bg-surface/40 transition-colors px-2"
              >
                <Icon size={16} className="text-muted-foreground" />
                <div className="min-w-0">
                  <div className="truncate">{r.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground md:hidden font-mono">
                    {r.author} · {r.date}
                  </div>
                </div>
                <div className="hidden md:block text-xs font-mono text-muted-foreground truncate">
                  {r.author}
                </div>
                <div className="hidden md:block text-xs font-mono text-muted-foreground">
                  {r.topic}
                </div>
                <a
                  href={r.href}
                  className="text-xs font-mono text-accent hover:underline text-right"
                >
                  {r.date}
                </a>
              </li>
            );
          })}
        </ul>
        {items.length === 0 && (
          <div className="py-24 text-center text-muted-foreground">Sem resultados.</div>
        )}
      </section>
    </>
  );
}
