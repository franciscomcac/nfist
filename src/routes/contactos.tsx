import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Linkedin, Youtube, Facebook } from "lucide-react";
import { TikTok } from "@/components/icons/tiktok";
import { SITE } from "@/content/site";
import { CampusMap } from "@/components/campus-map";

export const Route = createFileRoute("/contactos")({
  head: () => ({
    meta: [
      { title: "Contactos — NFIST" },
      {
        name: "description",
        content:
          "Contactar o NFIST — endereço no campus da Alameda, correio electrónico e redes sociais do núcleo.",
      },
      { property: "og:title", content: "Contactos — NFIST" },
      { property: "og:description", content: "Como contactar o NFIST." },
      { property: "og:url", content: "/contactos" },
    ],
    links: [{ rel: "canonical", href: "/contactos" }],
  }),
  component: ContactosPage,
});

function ContactosPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = encodeURIComponent(
      `${form.message}\n\n—\n${form.name}\n${form.email}`,
    );
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(form.subject || "Contacto via site")}&body=${body}`;
  }

  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-8 md:pb-10 border-b border-hairline">
        <div className="eyebrow mb-3">Contactos</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl max-w-3xl leading-[1.05]">
          Fale com o núcleo.
        </h1>
      </header>

      <section className="container-page py-12 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16">
        <div className="space-y-10">
          <div>
            <div className="eyebrow mb-3">Endereço</div>
            <address className="not-italic leading-relaxed">
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
              <br />
              {SITE.address.line3}
            </address>
          </div>

          <div>
            <div className="eyebrow mb-3">Correio electrónico</div>
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-lg border-b border-foreground/30 pb-0.5 hover:border-accent hover:text-accent transition-colors"
            >
              {SITE.email}
            </a>
          </div>

          <div>
            <div className="eyebrow mb-3">Redes sociais</div>
            <div className="flex gap-4">
              <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
              </a>
              <a href={SITE.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="text-muted-foreground hover:text-foreground">
                <TikTok size={20} />
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
              </a>
              <a href={SITE.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-foreground">
                <Youtube size={20} />
              </a>
              <a href={SITE.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <CampusMap />

        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="eyebrow mb-3">Mensagem</div>
          <div>
            <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Nome</label>
            <input
              id="contact-name"
              name="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border border-hairline h-11 px-3 focus:outline-none focus:border-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">E-mail</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border border-hairline h-11 px-3 focus:outline-none focus:border-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Assunto</label>
            <input
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-transparent border border-hairline h-11 px-3 focus:outline-none focus:border-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Mensagem</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent border border-hairline p-3 focus:outline-none focus:border-foreground/40 resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center h-11 px-6 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-accent transition-colors"
          >
            Enviar mensagem
          </button>
        </form>
      </section>
    </>
  );
}
