import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DIVISIONS, getDivision } from "@/content/divisions";
import { getEvent } from "@/content/events";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";
import { CircoTourMap } from "@/components/circo-tour-map";
import { img, imgSrcSet } from "@/lib/img";



export const Route = createFileRoute("/seccoes/$slug")({
  loader: ({ params }) => {
    const division = getDivision(params.slug);
    if (!division) throw notFound();
    return { division };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Secção não encontrada — NFIST" }, { name: "robots", content: "noindex" }] };
    }
    const d = loaderData.division;
    return {
      meta: [
        { title: `${d.name} — NFIST` },
        { name: "description", content: d.tagline },
        { property: "og:title", content: `${d.name} — NFIST` },
        { property: "og:description", content: d.tagline },
        { property: "og:image", content: d.hero },
        { property: "og:url", content: `/seccoes/${params.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: `/seccoes/${params.slug}` },
        { rel: "preload", as: "image", href: img(d.hero, 1600), fetchpriority: "high" },
        ...(d.gallery ?? []).map((url) => ({ rel: "preload", as: "image", href: img(url, 600) })),
      ],
    };
  },
  component: DivisionPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <div className="text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-4 font-serif text-4xl">Secção não encontrada</h1>
        <Link to="/seccoes" className="mt-6 inline-block text-sm border-b border-foreground/40">
          Ver todas as secções
        </Link>
      </div>
    </div>
  ),
});

function DivisionPage() {
  const { division: d } = Route.useLoaderData() as { division: (typeof DIVISIONS)[number] };
  const related = (d.relatedEvents ?? []).map(getEvent).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <header className="relative h-[60vh] sm:h-[70vh] min-h-[440px] sm:min-h-[520px] flex items-end overflow-hidden">
        <img
          src={img(d.hero, 1600, 75)}
          srcSet={imgSrcSet(d.hero, [768, 1200, 1600, 1920], 75)}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover duotone"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative container-page pb-12 md:pb-16">
          <div className="eyebrow mb-4">{d.eyebrow}</div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl leading-[1]">{d.name}</h1>
          <p className="mt-5 md:mt-6 max-w-xl text-base md:text-lg text-muted-foreground">{d.tagline}</p>
        </div>
      </header>

      {/* About */}
      <section className="container-prose py-16 md:py-24">
        <div className="eyebrow mb-6">Sobre</div>
        <div className="space-y-5 text-lg leading-relaxed">
          {d.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <div className="border-t border-hairline" />

      {/* Activities */}
      <section className="container-page py-16 md:py-24">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl max-w-xl">O que fazemos</h2>
        <div className="mt-10 md:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {d.activities.map((a) => (
            <div key={a.title} className="bg-background p-6 sm:p-8">
              <h3 className="font-serif text-xl">{a.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tour map — Circo only */}
      {d.slug === "circo" && (
        <section className="container-page py-16 md:py-24 border-t border-hairline">
          <div className="max-w-2xl mb-8 md:mb-10">
            <div className="eyebrow mb-3">Itinerário</div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl">De norte a sul, do continente às ilhas</h2>
            <p className="mt-4 text-muted-foreground">
              O Circo da Física é itinerante. Escolha uma paragem para ver onde levámos experiências, demonstrações e o gosto pela Física.
            </p>
          </div>
          <CircoTourMap />
        </section>
      )}

      {/* Participar */}

      <section className="container-page py-12 md:py-16 grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12">
        <div>
          <div className="eyebrow">Participar</div>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl">Áreas de participação</h2>
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-muted-foreground">
          {d.participation.map((p) => (
            <li key={p} className="border-b border-hairline pb-3">
              — {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Gallery */}
      {d.gallery && d.gallery.length > 0 && (
        <section className="container-page py-16 md:py-24">
          <div className="eyebrow mb-6">Registos</div>
          <Reveal>
            <Gallery images={d.gallery} alt={d.name} />
          </Reveal>
        </section>
      )}

      {/* Related events */}
      {related.length > 0 && (
        <section className="container-page py-16 md:py-24 border-t border-hairline">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl">Programas relacionados</h2>
          <div className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((e) => (
              <Link
                key={e!.slug}
                to="/eventos/$slug"
                params={{ slug: e!.slug }}
                className="group border border-hairline hover:bg-surface transition-colors p-6"
              >
                <div className="eyebrow">{e!.eyebrow}</div>
                <h3 className="mt-3 font-serif text-xl">{e!.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e!.short}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm group-hover:text-accent">
                  Ver detalhes <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other divisions */}
      <section className="container-page py-16 border-t border-hairline">
        <div className="eyebrow mb-4">Outras secções</div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {DIVISIONS.filter((x) => x.slug !== d.slug).map((x) => (
            <Link
              key={x.slug}
              to="/seccoes/$slug"
              params={{ slug: x.slug }}
              className="font-serif text-xl sm:text-2xl text-muted-foreground hover:text-foreground transition-colors"
            >
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
