import { createFileRoute, Link } from "@tanstack/react-router";
import { AsyncImg } from "@/components/async-img";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SITE, STATS } from "@/content/site";
import { DIVISIONS } from "@/content/divisions";
import { EVENTS } from "@/content/events";
import { REPOSITORY } from "@/content/repository";
import { Counter, Magnetic, Parallax, Reveal, SplitText, StaggerChildren } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CampusMap } from "@/components/campus-map";
import { img, imgSrcSet } from "@/lib/img";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NFIST — Núcleo de Física · Instituto Superior Técnico" },
      {
        name: "description",
        content:
          "NFIST — Núcleo de Física do IST: investigação, comunicação de ciência e divulgação de Física em Portugal.",
      },
      { property: "og:title", content: "NFIST — Núcleo de Física · IST" },
      {
        property: "og:description",
        content: "Investigação, comunicação de ciência e divulgação de Física em Portugal.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      {
        rel: "preload",
        as: "image",
        href: img("https://nfist.tecnico.ulisboa.pt/media/photos/NFIST-bg.JPG", 1600),
        fetchpriority: "high",
      },
    ],
  }),
  component: Home,
});

const HERO_IMG = "https://nfist.tecnico.ulisboa.pt/media/photos/NFIST-bg.JPG";

function Home() {
  const featured = EVENTS.find((e) => e.featured) ?? EVENTS[0];
  const others = EVENTS.filter((e) => e.slug !== featured.slug);
  const repoRecent = REPOSITORY.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative h-dvh min-h-[560px] md:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#05070f] text-white isolate">
        {/* Slack above and below so the parallax drift never exposes an edge. */}
        <Parallax as="div" className="absolute -inset-y-16 inset-x-0" speed={90}>
          <img
            src={img(HERO_IMG, 1600)}
            srcSet={imgSrcSet(HERO_IMG, [768, 1200, 1600, 1920])}
            sizes="100vw"
            alt=""
            className="absolute inset-0 h-full w-full object-cover hero-zoom"
            style={{ filter: "contrast(1.02) brightness(0.95) saturate(1.05)" }}
            fetchPriority="high"
          />
        </Parallax>

        <div className="absolute inset-0 bg-gradient-to-b from-[#05070f]/70 via-[#0A0E1A]/60 to-[#05070f]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#05070f_100%)]" />

        <Parallax as="div" className="relative container-page text-center" speed={-70} fade>
          <div className="max-w-4xl mx-auto">
            <Reveal
              as="p"
              dir="blur"
              delay={120}
              className="font-serif italic text-white text-2xl sm:text-3xl md:text-4xl leading-none [text-shadow:0_1px_12px_rgba(5,7,15,0.85)]"
            >
              Núcleo de Física
            </Reveal>
            <Reveal
              as="p"
              dir="blur"
              delay={280}
              className="mt-4 eyebrow text-[0.65rem] sm:text-xs tracking-[0.5em] !text-white/90 [text-shadow:0_1px_10px_rgba(5,7,15,0.9)]"
            >
              do Instituto Superior Técnico
            </Reveal>
            <h1 className="mt-8 font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[1.02] text-white tracking-tight">
              <span aria-hidden="true">
                <SplitText text="NFIST" by="char" delay={460} step={95} />
              </span>
              <span className="sr-only">NFIST — Núcleo de Física do Instituto Superior Técnico</span>
            </h1>
            <Reveal
              as="p"
              dir="up"
              delay={1080}
              className="mt-8 text-base md:text-lg text-white max-w-xl mx-auto [text-shadow:0_1px_12px_rgba(5,7,15,0.85)]"
            >
              {SITE.tagline}
            </Reveal>
          </div>
        </Parallax>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 chevron text-white/50" aria-hidden="true">
          <ChevronDown size={20} strokeWidth={1.2} />
        </div>
        {/* Smooth blend into the next section (both light and dark themes) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--background)]" />
      </section>

      {/* MISSION */}
      <section className="container-page py-14 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <Reveal>
          <div className="eyebrow mb-6">Sobre o núcleo</div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            <SplitText text="Um enquadramento institucional para a comunidade de Física do IST." step={42} />
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            <p>
              O NFIST é o enquadramento institucional através do qual a comunidade de física do Instituto Superior
              Técnico organiza seminários de investigação, programas de ciência para o público e iniciativas de
              divulgação a nível nacional.
            </p>
            <p>
              Fundado como núcleo estudantil, opera hoje cinco secções autónomas — do laboratório itinerante à revista
              científica, da observação astronómica à comunicação digital — e produz alguns dos maiores eventos de
              divulgação de Física em Portugal.
            </p>
          </div>
        </Reveal>
        <Reveal dir="scale" delay={140}>
          <div className="aspect-[4/3] md:aspect-[4/5] overflow-hidden border border-hairline group">
            <AsyncImg
              src={img("https://nfist.tecnico.ulisboa.pt/media/photos/direcao.JPG", 800)}
              srcSet={imgSrcSet("https://nfist.tecnico.ulisboa.pt/media/photos/direcao.JPG", [500, 800, 1100])}
              sizes="(min-width: 768px) 40vw, 100vw"
              alt="Direcção do NFIST"
              className="h-full w-full object-cover duotone transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Reveal>
      </section>

      <div className="border-t border-hairline" />

      {/* SECÇÕES */}
      <section className="container-page py-14 md:py-20">
        <SectionHeading
          eyebrow="Secções"
          title="Cinco secções, uma missão."
          intro="Cada secção desenvolve projectos próprios e sustenta uma vertente distinta do trabalho do núcleo — da divulgação experimental à publicação científica."
        />
        <StaggerChildren
          step={90}
          dir="up"
          className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline"
        >
          {DIVISIONS.map((d) => (
            <Link
              key={d.slug}
              to="/seccoes/$slug"
              params={{ slug: d.slug }}
              className="card-lift group bg-background hover:bg-surface p-6 sm:p-8 flex flex-col min-h-[240px] sm:min-h-[280px]"
            >
              <div className="eyebrow">{d.eyebrow}</div>
              <h3 className="mt-4 font-serif text-2xl">{d.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d.short}</p>
              <div className="mt-auto pt-6 flex items-center gap-2 text-sm text-foreground group-hover:text-accent transition-colors">
                Saber mais
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
          <div className="relative bg-background overflow-hidden min-h-[240px] sm:min-h-[280px] hidden lg:block group">
            <AsyncImg
              src={img("https://nfist.tecnico.ulisboa.pt/media/photos/nfist-bolo.JPG", 700)}
              srcSet={imgSrcSet("https://nfist.tecnico.ulisboa.pt/media/photos/nfist-bolo.JPG", [500, 700, 1000])}
              sizes="33vw"
              alt="Comunidade NFIST"
              className="absolute inset-0 h-full w-full object-cover duotone transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="eyebrow">Comunidade</div>
              <p className="mt-2 font-serif text-xl leading-snug">Cinco secções, uma missão partilhada.</p>
            </div>
          </div>
        </StaggerChildren>
      </section>
      <div className="border-t border-hairline" />

      {/* EVENTOS */}
      <section className="container-page py-14 md:py-20">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-8 md:mb-10">
          <SectionHeading
            eyebrow="Eventos e Programas"
            title="Os programas que levamos a cabo."
            intro="Do campus a escolas em todo o país, do arquipélago dos Açores à Madeira — cinco iniciativas contínuas de divulgação e formação em Física."
          />
          <Magnetic strength={0.35} className="shrink-0">
            <Link
              to="/eventos"
              className="group text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              Ver todos
              <ArrowRight size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </div>

        <Reveal dir="up">
          <Link
            to="/eventos/$slug"
            params={{ slug: featured.slug }}
            className="group grid md:grid-cols-2 gap-6 md:gap-10 items-center border border-hairline bg-surface/40 hover:bg-surface/70 transition-colors p-4 md:p-6"
          >
            <div className="aspect-[4/3] overflow-hidden border border-hairline">
              <AsyncImg
                src={img(featured.hero, 1000)}
                srcSet={imgSrcSet(featured.hero, [600, 900, 1200])}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={featured.name}
                className="h-full w-full object-cover duotone transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
            </div>
            <div>
              <div className="eyebrow text-accent">Evento principal · {featured.eyebrow}</div>
              <h3 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">{featured.name}</h3>
              <p className="mt-4 text-muted-foreground">{featured.short}</p>
              <div className="mt-5 font-mono text-xs text-muted-foreground">{featured.period}</div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-foreground group-hover:text-accent transition-colors">
                Explorar
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        </Reveal>

        <StaggerChildren step={100} dir="up" className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {others.map((e) => (
            <Link key={e.slug} to="/eventos/$slug" params={{ slug: e.slug }} className="group flex flex-col">
              <div className="aspect-[4/3] overflow-hidden border border-hairline">
                <AsyncImg
                  src={img(e.hero, 600)}
                  srcSet={imgSrcSet(e.hero, [400, 600, 900])}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  alt={e.name}
                  className="h-full w-full object-cover duotone transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="pt-4 min-w-0">
                <div className="eyebrow">{e.eyebrow}</div>
                <h4 className="mt-2 font-serif text-xl group-hover:text-accent transition-colors">{e.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.short}</p>
                <div className="mt-2 font-mono text-[0.7rem] text-muted-foreground">{e.period}</div>
              </div>
            </Link>
          ))}
        </StaggerChildren>
      </section>

      <div className="border-t border-hairline" />

      {/* NÚMEROS */}
      <section className="border-y border-hairline bg-surface/40">
        <StaggerChildren
          step={120}
          dir="up"
          className="container-page py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          {STATS.map((s, i) => (
            <div key={s.label}>
              <div className="font-serif text-3xl sm:text-4xl md:text-5xl">
                <Counter value={s.value} delay={i * 120} duration={1900} />
              </div>
              <div className="mt-3 eyebrow leading-relaxed">{s.label}</div>
            </div>
          ))}
        </StaggerChildren>
      </section>

      {/* REPOSITÓRIO */}
      <section className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <SectionHeading eyebrow="Repositório" title="Últimas publicações." />
          <Magnetic strength={0.35}>
            <Link
              to="/repositorio"
              className="group text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              Ver repositório
              <ArrowRight size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </div>
        <StaggerChildren as="ul" step={70} dir="left" className="border-t border-hairline">
          {repoRecent.map((r) => (
            <li
              key={r.id}
              className="border-b border-hairline py-5 grid grid-cols-[80px_minmax(0,1fr)_auto] sm:grid-cols-[100px_minmax(0,1fr)_140px_auto] gap-4 items-baseline text-sm transition-colors hover:bg-surface/40"
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">{r.type}</span>
              <span className="truncate">{r.title}</span>
              <span className="hidden sm:block font-mono text-[0.7rem] text-muted-foreground">{r.author}</span>
              <span className="font-mono text-[0.7rem] text-muted-foreground">{r.date}</span>
            </li>
          ))}
        </StaggerChildren>
      </section>

      {/* CONTACT */}
      <section className="container-page py-14 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <Reveal dir="up">
          <div className="eyebrow mb-4">Contactos</div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl">
            <SplitText text="Instituto Superior Técnico, Alameda." step={44} />
          </h2>
          <address className="mt-6 not-italic text-muted-foreground leading-relaxed">
            <div>{SITE.address.line1}</div>
            <div>{SITE.address.line2}</div>
            <div>{SITE.address.line3}</div>
          </address>
          <Magnetic strength={0.3} className="mt-6">
            <a
              href={"mailto:" + SITE.email}
              className="inline-block font-mono text-sm border-b border-foreground/30 pb-0.5 hover:border-accent hover:text-accent transition-colors"
            >
              {SITE.email}
            </a>
          </Magnetic>
        </Reveal>
        <Reveal dir="scale" delay={140}>
          <CampusMap />
        </Reveal>
      </section>
    </>
  );
}
