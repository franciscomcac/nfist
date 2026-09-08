# NFIST REVAMP

NFIST Website — Complete Ground-Up Revamp

Who You Are Building For

NFIST — Núcleo de Física do Instituto Superior Técnico is the physics research nucleus at Instituto Superior Técnico (Universidade de Lisboa), Portugal's top engineering university. It is NOT a startup. It is NOT a tech company. It is a serious scientific research and science-communication organisation that runs five operational divisions and produces large-scale public science events, academic conferences, astronomical observation programs, and itinerant physics exhibitions across Portugal and its Atlantic islands. Think of it as a cross between CERN's public engagement office and the Royal Institution — an executive-level body that bridges frontier physics research with national-scale science outreach. The website must reflect that gravitas.

Current site: https://nfist.tecnico.ulisboa.pt/

The Problem With the Current Site

The existing website looks like a first-year student club homepage. It has:

A generic dark theme with no typographic hierarchy

Swiper carousels that feel like a template

No visual storytelling or scientific identity

Navigation that dumps everything into dropdowns without context

No clear articulation of what the organisation actually does at a strategic level

Page titles like "circo" and "astro" in lowercase with no meta descriptions

Inconsistent page structures — some pages have footers, some don't

A "Repositório" (materials repository) and "Calendário" (calendar) that feel like afterthoughts

No sense of institutional weight, research credibility, or scientific authority

The overall impression is "student project" not "executive science organisation"

Kill all of that. Rebuild from zero.

Design Philosophy — Non-Negotiable Principles

1. This is a scientific institution, not a SaaS product

NO gradient hero sections with "Get Started" CTAs

NO startup jargon, no "empowering innovation" type copy

NO floating cards with drop shadows that look like a Stripe dashboard

NO cookie-cutter component library aesthetics

The design language should draw from: Nature journal, CERN.ch, Max Planck Institute, Niels Bohr Institute, European Space Agency. Clean, authoritative, spacious, deeply considered.

2. Typography is everything

Use a proper serif for headings — something like Playfair Display, Cormorant Garamond, EB Garamond, or Libre Baskerville. These convey academic weight.

Use a clean sans-serif for body text — Inter, Source Sans 3, or IBM Plex Sans.

Monospaced accents for data, dates, reference numbers — JetBrains Mono or IBM Plex Mono.

Generous line height (1.6–1.8 for body), tight tracking on large display headings.

Proper typographic scale — don't just size things randomly. Use a modular scale.

3. Colour palette

Build a palette that says "physics laboratory at midnight":

Primary background: Very deep navy/charcoal — not pure black. Something like #0A0E1A or #0D1117.

Secondary backgrounds: Subtle blue-grays for cards and sections — #141B2D, #1A2332.

Accent colour: A refined, cold accent — think deep electric blue (#2563EB), or a subtle gold/amber for institutional warmth (#C9A84C), or a muted teal (#14B8A6). Pick ONE primary accent.

Text: Off-white primary (#E8EAED), muted gray for secondary (#8B949E).

Borders/dividers: Hairline, barely visible — rgba(255,255,255,0.06).

Support a light mode too, but dark mode is the default. Light mode should feel like a printed academic journal — warm whites, deep navy text, cream-toned backgrounds.

4. Imagery

Reuse every image that currently exists on the site — event photos, group photos, telescope images, physics demonstrations, campus photos. These are real. Don't replace them with stock photos.

Present images with intention: full-bleed when the image is strong, contained with generous padding when it's documentary.

Add subtle image treatments — slight desaturation, or a very faint duotone wash in the brand palette to unify disparate photo qualities.

Use CSS object-fit: cover properly. No stretched or squished images.

5. Layout and spacing

Generous whitespace. Let the content breathe. This is not a news portal that crams everything above the fold.

Max content width of ~720px for text-heavy sections (like articles or event descriptions). Full-width for heroes and image grids.

Asymmetric layouts where appropriate — not everything needs to be centered.

Use a proper vertical rhythm (multiples of 8px or a consistent spacing scale).

6. Motion and interaction

Subtle, purposeful animations only. No bouncing, no parallax for the sake of parallax.

Fade-in-up on scroll for content blocks (use Intersection Observer, keep it gentle — 20px translate, 0.4s ease-out).

Smooth hover states on cards and links — opacity shifts, underline reveals, slight scale (1.01-1.02 max).

Page transitions if the framework supports it — simple cross-fade.

Site Architecture — Restructured From Scratch

Global Header

Fixed/sticky, semi-transparent with backdrop-blur on scroll.

Left: NFIST logo (the existing white logo at /media/logos/nfist-logo-white.png) + wordmark "NFIST" in the serif typeface. Below it in small caps: "Núcleo de Física · Instituto Superior Técnico".

Right: Navigation links — NOT dropdowns with everything jammed in. Clean top-level links:

Secções → leads to a page listing all five divisions

Eventos e Programas → leads to a page listing all events

Repositório → the materials/publications repository

Calendário

Contactos

Far right: Dark/light mode toggle (keep this, it's good — use a refined sun/moon icon toggle, not a chunky switch).

On mobile: hamburger menu that opens a full-screen overlay nav with large typography.

Global Footer

Three-column layout:

Column 1: NFIST logo + brief institutional tagline + university affiliation

Column 2: Quick links to all major pages

Column 3: Contact details (email, address at IST campus), social media icons (Instagram, LinkedIn, YouTube, any existing ones)

Bottom bar: © Núcleo de Física do Instituto Superior Técnico · Universidade de Lisboa

The footer should appear on EVERY page, consistently.

Page-by-Page Specifications

1. HOME PAGE (/)

This is the face of the organisation. It must make a visitor understand, within 5 seconds, that this is a serious scientific body.

Hero Section

Full-viewport height.

Background: A dramatic, full-bleed image from the existing site — ideally one of the telescope/astronomy photos, a physics demonstration in action, or a wide shot of a Semana da Física auditorium. Apply a very subtle dark gradient overlay so text is legible.

Centered text, stacked:

Small caps label: "NÚCLEO DE FÍSICA"

Large serif heading: "Instituto Superior Técnico"

One-line descriptor in sans-serif, muted: "A promover a investigação em física. A comunicar ciência à nação."

No CTA button in the hero. Just the statement. Let it land.

Subtle scroll indicator at the bottom (thin animated chevron or "↓").

Mission / About Block

Two-column layout: text on left, image on right.

Short, precise copy (2-3 paragraphs max) about what NFIST is. Use the real information:

Founded as a student-led nucleus at IST

Operates five research and outreach divisions

Produces Portugal's largest student-organised physics events

Bridges academic physics with public science communication

Keep the language precise and institutional. No fluff. No "somos apaixonados por física!" — instead: "O NFIST é o enquadramento institucional através do qual a comunidade de física do IST organiza seminários de investigação, programas de ciência para o público e iniciativas de divulgação a nível nacional."

The image should be a real photo from the existing site — perhaps a group photo or an event in action.

Research Divisions Grid

Section heading: "Secções"

Five cards in a grid — one for each division:

Circo da Física — Demonstrações de física e comunicação de ciência experimental

Astro — Observação astronómica, operação de telescópios e divulgação de astrofísica

Pulsar — Publicação científica e produção editorial

Recreativa — Comunidade académica e cultura científica estudantil

Info — Comunicações digitais, produção multimédia e podcast (Watt's Beyond)

Each card should have:

Division name in serif, with a subtle icon or small image

2-line description of what the division does

"Saber mais →" link to the division's dedicated page

Cards should have very subtle borders, with a refined hover effect (slight background tint shift, not a dramatic shadow pop).

Featured Events / Programmes

Section heading: "Eventos e Programas"

Display the major events as a staggered editorial layout (not a carousel):

Semana da Física — The flagship. Give it the most visual real estate. Large image + title + one-line summary + date.

Jornadas de Engenharia Física (JEF) — Academic conference. Show with image + summary.

Escola de Verão de Astronomia (EVA) — Summer astronomy school. Show with image + summary.

Física sobre Rodas — Itinerant physics exhibition across Portugal. Show with image + summary.

Estrelas Sobre o Atlântico — Science outreach to the Atlantic islands. Show with image + summary.

Use existing event photos. Each event should link to its dedicated page.

Layout: Consider a magazine-style grid where the first item spans two columns and the rest fill in. Or a vertical timeline. NOT a boring card grid.

Latest From the Repository

Optional but valuable: show 3-4 recent items from the repository (materials, past publications, lecture notes, etc.) in a compact list or horizontal scroll.

Each item: title, type (PDF/article/video), date. Links to the repository page.

Numbers / Impact Section

A discreet horizontal band with key figures:

"XX anos de actividade"

"XX 000+ alunos alcançados pela Semana da Física"

"XX eventos por ano lectivo"

"5 secções de investigação e divulgação"

Present as large serif numerals with small labels below. Keep it understated.

Contact Section

Keep it at the bottom, before the footer.

IST campus address, general email, embedded Google Maps (small, tasteful), social media links.

2. DIVISIONS OVERVIEW PAGE (/seccoes/ or /grupos/)

Hero: smaller than homepage — page title "Secções" with a one-line subtitle.

Below: the five divisions listed with more detail than the homepage cards. Each gets:

A large image (existing photos)

Division name + full paragraph description

Key activities / ongoing projects listed

Link to the individual division page

Consider alternating layout: Division 1 image-left/text-right, Division 2 text-left/image-right, etc.

3. INDIVIDUAL DIVISION PAGES (/seccoes/circo/, /seccoes/astro/, /seccoes/pulsar/, /seccoes/recreativa/, /seccoes/info/)

Each division gets a proper landing page:

Hero: Division name in large serif, one-line descriptor, hero image from existing assets.

About section: 2-3 paragraphs explaining the division's mission, scope, and role within NFIST.

Activities/Projects section: What do they actually do? List ongoing and past projects.

Gallery: Grid of real photos from that division's activities (reuse existing images).

Team section (if data exists): Grid of team members with name, role, small photo.

Related events: Auto-link to events that this division organises (e.g., Circo → Semana da Física; Astro → EVA, Estrelas Sobre o Atlântico).

Specific division notes:

Circo da Física: Emphasise the live physics demonstrations, the educational mission, the hands-on experiments. This is the most visually spectacular division — the "showroom" of NFIST.

Astro: Emphasise telescope observations, astrophotography, the astronomy summer school. Use any existing star/telescope imagery heavily. Night sky, observation sessions, IST observatory.

Pulsar: This is the scientific publication arm. Make it feel editorial — like a journal homepage. Show past issues, featured articles from PhysikUPDATE.

Recreativa: Student life, academic integration, social events, tournaments. Warmer tone, but still institutional.

Info: Digital and media arm. Mention the "Watt's Beyond" podcast, PhysikUPDATE newsletter, social media strategy. More contemporary visual language.

4. EVENTS & PROGRAMMES OVERVIEW PAGE (/eventos/)

List all events with more editorial treatment than the homepage.

Each event gets a card with: large image, title, date/period, one-paragraph summary, "Ver detalhes →" link.

Group events chronologically or by type (eventos principais vs. recorrentes vs. especiais).

Add a filter or simple category tabs if there are enough events.

5. INDIVIDUAL EVENT PAGES

Each event gets its own dedicated page:

Semana da Física (/eventos/semana-da-fisica/)

Hero with the event logo/poster (if one exists in existing assets), title, dates.

Tag: "Evento Principal"

Full description: what it is, when it happens, who it's for, what activities are included.

Photo gallery from past editions (reuse existing Swiper/carousel images but present them better — a proper masonry grid or a clean lightbox gallery, not a generic Swiper).

Schedule/programme details if available.

How to participate / registration info.

Jornadas de Engenharia Física — JEF (/eventos/jornadas-engenharia-fisica/)

Academic conference page. Show speakers, programme schedule, past editions.

Emphasise the bridge between academia and industry.

Escola de Verão de Astronomia — EVA (/eventos/escola-de-verao-de-astronomia/)

Summer school for secondary students. Show what students do, past photos, programme.

Testimonials if available.

Física sobre Rodas (/eventos/fisica-sobre-rodas/)

Itinerant exhibition. Show a map of locations visited across Portugal. Use event photos.

Emphasise the reach — bringing physics to places that don't normally get it.

Estrelas Sobre o Atlântico (/eventos/estrelas-sobre-o-atlantico/)

Science outreach to the Azores/Madeira. Beautiful opportunity for dramatic imagery.

Emphasise the unique mission of bringing science to island communities.

6. REPOSITORY PAGE (/repositorio/)

Title: "Repositório de Materiais"

This should feel like an academic digital library, not a file dump.

Search bar at the top.

Filter by: type (PDF, video, lecture notes, article), topic/subject, year/date.

Each item displayed as a compact list row:

Icon for file type (PDF icon, video icon, etc.)

Title

Author/contributor

Date

Download/view link

Pagination or infinite scroll for large collections.

Clean, tabular, no visual clutter.

7. CALENDAR PAGE (/calendario/)

Embed or build a proper calendar view (month view with event dots/badges).

Each day with an event shows a small indicator; clicking reveals the event details.

Alternative list view: upcoming events in chronological order with date, title, location, time.

Toggle between calendar and list view.

The Google Calendar embed (if that's what they currently use) should be styled to match the site theme — or replaced with a custom component.

8. CONTACT PAGE (/contactos/)

Can be a section at the bottom of the homepage AND a standalone page.

Address: Instituto Superior Técnico, Av. Rovisco Pais 1, 1049-001 Lisboa

Email: the NFIST contact email

Social media: Instagram, LinkedIn, YouTube, Facebook (use existing links)

Small embedded map of IST campus

Optional: a simple contact form (name, email, subject, message).

Technical Requirements

Framework: Use React with Vite (or whatever Lovable's stack supports natively). Use React Router for client-side routing.

Styling: Tailwind CSS is fine if that's the Lovable default, but ensure custom values are set in the config — don't use default Tailwind blue for everything. Define a proper design token system with the palette above.

Responsive: Every page must work flawlessly on mobile (320px), tablet (768px), and desktop (1440px+). Test at all breakpoints.

Performance: Lazy-load images. Use modern image formats where possible. Keep the bundle lean.

SEO: Proper <title>, <meta description>, Open Graph tags on every page. Semantic HTML (<article>, <section>, <nav>, <main>, <header>, <footer>).

Accessibility: Proper ARIA labels, keyboard navigation, focus management, sufficient colour contrast (WCAG AA minimum).

Dark/light mode: Default to dark. Toggle persisted in localStorage. Transition should be smooth (CSS custom properties flipping, 200ms transition on background-color and color).

Language: Keep the site in Portuguese. All navigation labels, headings, body text, and UI strings should be in Portuguese.

Content to Reuse

Pull all existing text content from the current site at https://nfist.tecnico.ulisboa.pt/ and improve it editorially — tighten the prose, fix any awkward phrasing, add context where missing — but do NOT invent content. Everything should be grounded in what the organisation actually does. The key content areas:

All event descriptions from the current event pages (Semana da Física, JEF, EVA, Física sobre Rodas, Estrelas Sobre o Atlântico)

All division/group descriptions from the current group pages (Circo, Astro, Pulsar, Recreativa, Info)

Any blog posts or articles in the repository

Contact information

Social media links

All photography and images currently hosted on the site at https://nfist.tecnico.ulisboa.pt/media/

Image paths to preserve and reuse (reference from the existing domain or rehost):

/media/logos/nfist-logo-white.png — The main NFIST logo (used in header on every page)

All event-specific images, group photos, demonstration photos, astronomy photos found on event and group subpages

All carousel/swiper images from the homepage

Any poster images or promotional graphics

What Success Looks Like

When someone — a physics professor, a prospective student, a government science funding body, a journalist writing about Portuguese science, or a fellow research institution — lands on this website, they should immediately think:

"This is a serious, well-run scientific organisation. These people know what they're doing."

NOT:

"Oh, this is a student club website."

The design should feel like it belongs alongside the websites of the Max Planck Society, the Niels Bohr Institute, or CERN's public engagement pages. Executive, clean, authoritative, intellectually rigorous. No visual clutter, no gimmicks, no AI-generated filler text, no startup energy.

Build the entire thing. Every page. Every section. Fully functional routing, responsive design, real content. Do not scaffold or stub — deliver a complete website.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nfist.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2c903642-c046-4e10-bd2d-36d0216ba0e8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
