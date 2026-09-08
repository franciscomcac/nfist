import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube, Facebook } from "lucide-react";
import { TikTok } from "@/components/icons/tiktok";
import { Magnetic, Reveal, StaggerChildren } from "@/components/reveal";
import { NAV, SITE } from "@/content/site";

const SOCIALS = [
  { key: "instagram", href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
  { key: "tiktok", href: SITE.social.tiktok, label: "TikTok", Icon: TikTok },
  { key: "facebook", href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
  { key: "youtube", href: SITE.social.youtube, label: "YouTube", Icon: Youtube },
  { key: "linkedin", href: SITE.social.linkedin, label: "LinkedIn", Icon: Linkedin },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-hairline bg-surface/40">
      <StaggerChildren
        as="div"
        step={110}
        dir="up"
        className="container-page py-16 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        <div>
          <div className="flex items-center ml-6 sm:ml-8">
            <div className="h-12 w-12 shrink-0 flex items-center justify-center overflow-visible">
              <img src={SITE.logoWhite} alt="NFIST" className="h-11 w-11 object-contain scale-[2] [.light_&]:invert" />
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground max-w-xs">
            Enquadramento institucional para a investigação e comunicação de Física no Instituto Superior Técnico da
            Universidade de Lisboa.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4">Navegar</div>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-sweep text-muted-foreground hover:text-foreground transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Contacto</div>
          <address className="not-italic text-sm text-muted-foreground space-y-1">
            <div>{SITE.address.line1}</div>
            <div>{SITE.address.line2}</div>
            <div>{SITE.address.line3}</div>
            <div className="pt-3">
              <a
                href={"mailto:" + SITE.email}
                className="link-sweep font-mono text-foreground hover:text-accent transition-colors"
              >
                {SITE.email}
              </a>
            </div>
          </address>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ key, href, label, Icon }) => (
              <Magnetic key={key} strength={0.4}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-accent"
                >
                  <Icon size={16} />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </StaggerChildren>

      <div className="border-t border-hairline">
        <Reveal
          dir="none"
          className="container-page py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground font-mono"
        >
          <div>© {new Date().getFullYear()} Núcleo de Física do Instituto Superior Técnico</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacidade" className="link-sweep hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="link-sweep hover:text-foreground transition-colors">
              Aviso legal
            </Link>
            <span>Universidade de Lisboa</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
