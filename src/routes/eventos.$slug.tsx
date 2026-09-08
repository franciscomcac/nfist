import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { EVENTS, getEvent } from "@/content/events";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";
import { img, imgSrcSet } from "@/lib/img";


export const Route = createFileRoute("/eventos/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Evento não encontrado — NFIST" }, { name: "robots", content: "noindex" }] };
    }
    const e = loaderData.event;
    return {
      meta: [
        { title: `${e.name} — NFIST` },
        { name: "description", content: e.short },
        { property: "og:title", content: `${e.name} — NFIST` },
        { property: "og:description", content: e.short },
        { property: "og:image", content: e.hero },
        { property: "og:url", content: `/eventos/${params.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `/eventos/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: e.name,
            description: e.short,
            image: e.hero,
            location: { "@type": "Place", name: e.location },
            organizer: { "@type": "Organization", name: "NFIST" },
          }),
        },
      ],
    };
  },
  component: EventPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <div className="text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-4 font-serif text-4xl">Evento não encontrado</h1>
        <Link to="/eventos" className="mt-6 inline-block text-sm border-b border-foreground/40">
          Ver todos os eventos
        </Link>
      </div>
    </div>
  ),
});

function EventPage() {
  const { event: e } = Route.useLoaderData() as { event: (typeof EVENTS)[number] };
  const others = EVENTS.filter((x) => x.slug !== e.slug).slice(0, 3);

  return (
    <>
      <header className="relative pt-24 md:pt-32 pb-8 md:pb-10 border-b border-hairline overflow-hidden">
        <div className="container-page grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-end">
          <div>
            <div className="eyebrow mb-3">{e.eyebrow}</div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.05]">{e.name}</h1>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-muted-foreground max-w-xl">{e.short}</p>
            <div className="mt-5 md:mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs">
              <div>
                <div className="text-muted-foreground uppercase tracking-wider">Periodicidade</div>
                <div className="mt-1 text-foreground">{e.period}</div>
              </div>
              <div>
                <div className="text-muted-foreground uppercase tracking-wider">Local</div>
                <div className="mt-1 text-foreground">{e.location}</div>
              </div>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden border border-hairline">
            <img
              src={img(e.hero, 1200, 78)}
              srcSet={imgSrcSet(e.hero, [600, 900, 1200, 1600], 78)}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={e.name}
              fetchPriority="high"
              className="h-full w-full object-cover duotone"
            />
          </div>

        </div>
      </header>

      {/* Description */}
      <section className="container-prose py-16 md:py-24">
        <div className="eyebrow mb-6">Sobre o programa</div>
        <div className="space-y-5 text-base md:text-lg leading-relaxed">
          {e.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Programme + info sidebar */}
      {(e.programme || e.info) && (
        <section className="container-page py-12 md:py-16 border-t border-hairline grid md:grid-cols-[2fr_1fr] gap-10 md:gap-16">
          {e.programme && (
            <div>
              <div className="eyebrow mb-6">Programa</div>
              <ul className="space-y-6">
                {e.programme.map((p) => (
                  <li key={p.title} className="border-b border-hairline pb-6">
                    <div className="font-serif text-xl sm:text-2xl">{p.title}</div>
                    <p className="mt-2 text-muted-foreground">{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {e.info && (
            <aside className="bg-surface/50 border border-hairline p-6 h-fit">
              <div className="eyebrow mb-4">Informação</div>
              <dl className="space-y-4 text-sm">
                {e.info.map((i) => (
                  <div key={i.label}>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {i.label}
                    </dt>
                    <dd className="mt-1">{i.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </section>
      )}

      {/* Locations (FSR) */}
      {e.locations && (
        <section className="container-page py-16 border-t border-hairline">
          <div className="eyebrow mb-6">Locais visitados</div>
          <div className="flex flex-wrap gap-2">
            {e.locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-2 border border-hairline px-3 py-1.5 text-sm"
              >
                <MapPin size={12} className="text-accent" /> {loc}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {e.gallery && e.gallery.length > 0 && (
        <section className="container-page py-16 md:py-24 border-t border-hairline">
          <div className="eyebrow mb-6">Registos</div>
          <Reveal>
            <Gallery images={e.gallery} alt={e.name} />
          </Reveal>
        </section>
      )}

      {/* Others */}
      <section className="container-page py-16 border-t border-hairline">
        <div className="eyebrow mb-6">Outros programas</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/eventos/$slug"
              params={{ slug: o.slug }}
              className="group border border-hairline p-6 hover:bg-surface transition-colors"
            >
              <div className="eyebrow">{o.eyebrow}</div>
              <h3 className="mt-3 font-serif text-xl">{o.name}</h3>
              <div className="mt-3 inline-flex items-center gap-2 text-sm group-hover:text-accent">
                Ver <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
