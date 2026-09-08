import { createFileRoute, Link } from "@tanstack/react-router";
import { AsyncImg } from "@/components/async-img";
import { ArrowRight } from "lucide-react";
import { DIVISIONS } from "@/content/divisions";
import { Reveal } from "@/components/reveal";
import { img, imgSrcSet } from "@/lib/img";


export const Route = createFileRoute("/seccoes/")({
  head: () => ({
    meta: [
      { title: "Secções — NFIST" },
      {
        name: "description",
        content:
          "As cinco secções autónomas do NFIST — Circo da Física, Astro, Pulsar, ReCreativa e Info — que sustentam a actividade de investigação, publicação e divulgação do núcleo.",
      },
      { property: "og:title", content: "Secções — NFIST" },
      { property: "og:description", content: "Circo da Física, Astro, Pulsar, ReCreativa e Info." },
      { property: "og:url", content: "/seccoes" },
    ],
    links: [
      { rel: "canonical", href: "/seccoes" },
      ...DIVISIONS.map((division) => ({ rel: "preload", as: "image", href: img(division.hero, 1000) })),
    ],
  }),
  component: SeccoesOverview,
});

function SeccoesOverview() {
  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-8 md:pb-10 border-b border-hairline">
        <div className="eyebrow mb-3">Secções</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl max-w-3xl leading-[1.05]">
          As cinco secções que sustentam o núcleo.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Cada secção opera autonomamente, com equipa e programa próprios, cobrindo áreas
          distintas — da divulgação experimental à publicação científica.
        </p>
      </header>

      <div className="container-page py-16 md:py-24 space-y-20 md:space-y-32">
        {DIVISIONS.map((d, i) => (
          <Reveal key={d.slug}>
            <article
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden border border-hairline">
                <AsyncImg
                  src={img(d.hero, 1000)}
                  srcSet={imgSrcSet(d.hero, [600, 900, 1200])}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={d.name}
                  priority
                  className="h-full w-full object-cover duotone"
                 />

              </div>
              <div>
                <div className="eyebrow">{d.eyebrow}</div>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">{d.name}</h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">{d.about[0]}</p>
                <ul className="mt-6 space-y-2">
                  {d.activities.slice(0, 3).map((a) => (
                    <li key={a.title} className="text-sm text-muted-foreground">
                      <span className="text-foreground">— {a.title}.</span> {a.body}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/seccoes/$slug"
                  params={{ slug: d.slug }}
                  className="mt-8 inline-flex items-center gap-2 text-sm border-b border-foreground/40 pb-0.5 hover:border-accent hover:text-accent transition-colors"
                >
                  Conhecer {d.name} <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
