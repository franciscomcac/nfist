import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/content/site";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Aviso Legal — NFIST" },
      {
        name: "description",
        content:
          "Termos de utilização e aviso legal do Site institucional do Núcleo de Física do Instituto Superior Técnico.",
      },
      { property: "og:title", content: "Aviso Legal — NFIST" },
      {
        property: "og:description",
        content: "Termos de utilização do Site do NFIST.",
      },
      { property: "og:url", content: "/termos" },
    ],
    links: [{ rel: "canonical", href: "/termos" }],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-6 md:pb-8 border-b border-hairline">
        <div className="eyebrow mb-3">Documento legal</div>
        <h1 className="font-serif italic text-4xl md:text-6xl leading-[0.95] tracking-tight">
          Aviso Legal
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Termos de utilização do Site institucional do Núcleo de Física do Instituto Superior
          Técnico. A utilização deste Site pressupõe a aceitação das condições abaixo.
        </p>
      </header>

      <article className="container-page py-14 md:py-20 max-w-3xl space-y-12 text-[15px] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl mb-3">1. Identificação</h2>
          <p className="text-muted-foreground">
            Este Site é propriedade do Núcleo de Física do Instituto Superior Técnico
            (&ldquo;NFIST&rdquo;), associação estudantil sedeada no campus da Alameda, Av. Rovisco
            Pais 1, 1049-001 Lisboa, Portugal. Contacto:{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-foreground hover:text-accent transition-colors"
            >
              {SITE.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">2. Objecto</h2>
          <p className="text-muted-foreground">
            O Site destina-se à divulgação institucional das actividades, secções, eventos e
            publicações do NFIST. O acesso é livre e gratuito. O NFIST reserva-se o direito de
            alterar, suspender ou descontinuar, em qualquer momento e sem aviso prévio, qualquer
            conteúdo ou funcionalidade.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">3. Propriedade intelectual</h2>
          <p className="text-muted-foreground">
            Todo o conteúdo publicado — textos, fotografias, vídeos, marcas, logótipos e material
            gráfico — é propriedade do NFIST ou dos respectivos autores, sendo utilizado com
            autorização. A reprodução, distribuição ou utilização derivada de qualquer conteúdo
            para fins não pessoais carece de autorização prévia e escrita, devendo ser sempre
            atribuída a devida autoria.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">4. Utilização aceitável</h2>
          <p className="text-muted-foreground mb-3">
            O visitante compromete-se a utilizar o Site de forma lícita e a não:
          </p>
          <ul className="space-y-1.5 text-muted-foreground list-disc pl-5">
            <li>Praticar actos que perturbem o normal funcionamento do Site;</li>
            <li>Tentar aceder a áreas restritas ou a dados de outros utilizadores;</li>
            <li>Utilizar o formulário de contacto ou os endereços do NFIST para envio de comunicações não solicitadas;</li>
            <li>Reproduzir, copiar ou apropriar-se de conteúdos em violação do ponto anterior.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">5. Ligações externas</h2>
          <p className="text-muted-foreground">
            O Site contém ligações para páginas externas, nomeadamente ao Instituto Superior
            Técnico, à Universidade de Lisboa e a serviços prestados por terceiros (Google Maps,
            Google Calendar, redes sociais). O NFIST não assume responsabilidade pelo conteúdo,
            políticas de privacidade ou práticas dessas entidades.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">6. Limitação de responsabilidade</h2>
          <p className="text-muted-foreground">
            O NFIST envida esforços para manter a informação actualizada e exacta, mas não garante
            a ausência de erros ou omissões. A utilização do Site é feita sob responsabilidade do
            visitante, não sendo o NFIST responsável por danos directos ou indirectos decorrentes
            do acesso, utilização ou impossibilidade de utilização deste Site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">7. Enquadramento institucional</h2>
          <p className="text-muted-foreground">
            O NFIST é um núcleo estudantil do Instituto Superior Técnico. As opiniões, iniciativas
            e conteúdos aqui publicados são da responsabilidade do núcleo e não vinculam
            formalmente o Instituto Superior Técnico ou a Universidade de Lisboa, salvo indicação
            expressa em contrário.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">8. Lei aplicável</h2>
          <p className="text-muted-foreground">
            Os presentes termos regem-se pela lei portuguesa. Para o julgamento de quaisquer
            litígios emergentes da utilização do Site é competente o foro da comarca de Lisboa,
            com expressa renúncia a qualquer outro.
          </p>
        </section>
      </article>
    </>
  );
}
