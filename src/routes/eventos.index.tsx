import { createFileRoute, Link } from "@tanstack/react-router";
import { AsyncImg } from "@/components/async-img";
import { ArrowRight } from "lucide-react";
import { EVENTS, type EventCategory } from "@/content/events";
import { Reveal } from "@/components/reveal";
import { EventsMap } from "@/components/events-map";
import { img, imgSrcSet } from "@/lib/img";


export const Route = createFileRoute("/eventos/")({
  head: () => ({
    meta: [
      { title: "Eventos e Programas — NFIST" },
      {
        name: "description",
        content:
          "Semana da Física, Jornadas de Engenharia Física, EVA, Física sobre Rodas e Estrelas Sobre o Atlântico — os programas de divulgação e formação do NFIST.",
      },
      { property: "og:title", content: "Eventos e Programas — NFIST" },
      { property: "og:description", content: "Os programas contínuos de divulgação e formação do NFIST." },
      { property: "og:url", content: "/eventos" },
    ],
    links: [{ rel: "canonical", href: "/eventos" }],
  }),
  component: EventosIndex,
});

const GROUPS: { key: EventCategory; label: string; caption: string }[] = [
  { key: "principal", label: "Evento principal", caption: "O evento de referência do calendário anual do NFIST." },
  { key: "recorrente", label: "Programas anuais", caption: "Ciclos de programação regular que estruturam o ano do núcleo." },
  { key: "especial", label: "Projectos especiais", caption: "Iniciativas de escala nacional com carácter itinerante ou bienal." },
];

function EventosIndex() {
  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-8 md:pb-10 border-b border-hairline">
        <div className="eyebrow mb-3">Eventos e Programas</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl max-w-3xl leading-[1.05]">
          Os programas que sustentam a actividade do núcleo.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Uma agenda contínua de divulgação, formação e proximidade — do campus do IST às escolas
          do país, dos Açores à Madeira.
        </p>
      </header>

      <section className="hidden md:block container-page py-12 md:py-16 border-b border-hairline">
        <div className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8 items-baseline mb-8 md:mb-10">
          <div className="eyebrow">Mapa de actividades</div>
          <p className="text-muted-foreground">
            Onde o NFIST tem estado — do campus da Alameda às ilhas atlânticas. Clique num marcador
            para ver o evento associado.
          </p>
        </div>
        <EventsMap />
      </section>

      <div className="container-page py-12 md:py-16 space-y-16 md:space-y-24">
        {GROUPS.map((g) => {
          const items = EVENTS.filter((e) => e.category === g.key);
          if (!items.length) return null;
          return (
            <section key={g.key}>
              <div className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8 items-baseline mb-8 md:mb-10">
                <div className="eyebrow">{g.label}</div>
                <p className="text-muted-foreground">{g.caption}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((e) => (
                  <Reveal key={e.slug}>
                    <Link
                      to="/eventos/$slug"
                      params={{ slug: e.slug }}
                      className="group flex flex-col h-full"
                    >
                      <div className="aspect-[4/3] overflow-hidden border border-hairline">
                        <AsyncImg
                          src={img(e.hero, 700)}
                          srcSet={imgSrcSet(e.hero, [400, 600, 900])}
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          alt={e.name}
                          decoding="async"
                          className="h-full w-full object-cover duotone transition-transform duration-500 group-hover:scale-[1.03]"
                         />

                      </div>
                      <div className="pt-5 flex flex-col grow">
                        <div className="eyebrow">{e.eyebrow}</div>
                        <h3 className="mt-2 font-serif text-2xl">{e.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{e.short}</p>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-mono text-muted-foreground">
                          <span>{e.period}</span>
                          <span className="inline-flex items-center gap-1 text-foreground group-hover:text-accent transition-colors">
                            Detalhes <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
