import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AmbientBackground } from "@/components/ambient-background";
import { ImagePrefetcher } from "@/components/image-prefetcher";
import { ScrollProgress } from "@/components/reveal";
import { SITE } from "@/content/site";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="max-w-md text-center">
        <div className="eyebrow">Erro 404</div>
        <h1 className="mt-4 font-serif text-5xl">Página não encontrada</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          A página que procura pode ter sido movida ou já não existe.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm border-b border-foreground/40 pb-0.5 hover:border-foreground transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const isNavigating = useRouterState({ select: (state) => state.status === "pending" });
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="max-w-md text-center">
        <div className="eyebrow">Erro</div>
        <h1 className="mt-4 font-serif text-4xl">Esta página não carregou</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Algo correu mal do nosso lado. Pode tentar recarregar ou voltar ao início.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-hairline px-4 py-2 hover:bg-surface transition-colors"
          >
            Tentar novamente
          </button>
          <a href="/" className="border border-hairline px-4 py-2 hover:bg-surface transition-colors">
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

// Runs before paint: honour a saved choice, otherwise follow the OS setting.
// Keeps following the OS until the visitor picks a theme themselves.
const THEME_INIT =
  "(function(){try{var KEY='nfist-theme';var root=document.documentElement;var mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: light)'):null;var saved=null;try{saved=localStorage.getItem(KEY);}catch(e){}var apply=function(t){root.classList.toggle('dark',t==='dark');root.classList.toggle('light',t==='light');};apply(saved||((mq&&mq.matches)?'light':'dark'));if(!saved&&mq){var on=function(e){var still=null;try{still=localStorage.getItem(KEY);}catch(err){}if(still)return;apply(e.matches?'light':'dark');try{window.dispatchEvent(new Event('nfist:theme'));}catch(err){}};if(mq.addEventListener){mq.addEventListener('change',on);}else if(mq.addListener){mq.addListener(on);}}}catch(e){}})();";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NFIST — Núcleo de Física · Instituto Superior Técnico" },
      {
        name: "description",
        content:
          "Núcleo de Física do Instituto Superior Técnico. Investigação, comunicação de ciência e divulgação de Física em Portugal.",
      },
      { property: "og:site_name", content: "NFIST" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "NFIST — Núcleo de Física · IST" },
      {
        property: "og:description",
        content: "Investigação, comunicação de ciência e divulgação de Física em Portugal.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://nfist.tecnico.ulisboa.pt", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://maps.googleapis.com" },
      { rel: "dns-prefetch", href: "https://maps.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.fullName,
          alternateName: "NFIST",
          parentOrganization: {
            "@type": "CollegeOrUniversity",
            name: "Instituto Superior Técnico · Universidade de Lisboa",
          },
          email: SITE.email,
          sameAs: Object.values(SITE.social),
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      <AmbientBackground />
      <ImagePrefetcher />

      <ScrollProgress />
      <div className="route-progress" data-active={isNavigating ? "true" : "false"} aria-hidden="true" />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {/* Keyed on the path so each navigation replays the entrance. */}
        <div key={pathname} className="page-in">
          <Outlet />
        </div>
      </main>
      {!isAdmin && <SiteFooter />}
    </QueryClientProvider>
  );
}
