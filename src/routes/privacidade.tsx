import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/content/site";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — NFIST" },
      {
        name: "description",
        content:
          "Como o Núcleo de Física do Instituto Superior Técnico trata dados pessoais recolhidos através deste Site, ao abrigo do RGPD.",
      },
      { property: "og:title", content: "Política de Privacidade — NFIST" },
      {
        property: "og:description",
        content: "Tratamento de dados pessoais no Site do NFIST.",
      },
      { property: "og:url", content: "/privacidade" },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-6 md:pb-8 border-b border-hairline">
        <div className="eyebrow mb-3">Documento legal</div>
        <h1 className="font-serif italic text-4xl md:text-6xl leading-[0.95] tracking-tight">
          Política de Privacidade
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Esta página descreve como o Núcleo de Física do Instituto Superior Técnico (adiante
          &ldquo;NFIST&rdquo;) recolhe e trata dados pessoais dos visitantes deste Site, em
          conformidade com o Regulamento Geral sobre a Protecção de Dados (RGPD, UE 2016/679) e
          demais legislação portuguesa aplicável.
        </p>
        <p className="mt-2 text-xs font-mono text-muted-foreground">
          Última actualização: {new Date().toLocaleDateString("pt-PT", { year: "numeric", month: "long" })}
        </p>
      </header>

      <article className="container-page py-14 md:py-20 max-w-3xl space-y-12 text-[15px] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl mb-3">1. Responsável pelo tratamento</h2>
          <p className="text-muted-foreground">
            O responsável pelo tratamento dos dados pessoais é o Núcleo de Física do Instituto
            Superior Técnico, com sede na Av. Rovisco Pais 1, 1049-001 Lisboa, Portugal. Para
            qualquer questão relacionada com a protecção de dados, contactar através do endereço{" "}
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
          <h2 className="font-serif text-2xl mb-3">2. Dados recolhidos</h2>
          <p className="text-muted-foreground mb-3">
            Este Site recolhe apenas os dados estritamente necessários para o seu funcionamento e
            para o contacto entre o NFIST e os seus visitantes:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>
              <strong className="text-foreground">Formulário de contacto:</strong> nome, endereço de
              correio electrónico, assunto e mensagem — enviados directamente para{" "}
              <span className="font-mono">{SITE.email}</span> através do cliente de e-mail do
              utilizador.
            </li>
            <li>
              <strong className="text-foreground">Correspondência voluntária:</strong> mensagens
              enviadas por e-mail ou redes sociais são conservadas o tempo necessário para a
              resposta e o seguimento institucional.
            </li>
          </ul>
          <p className="text-muted-foreground mt-3">
            O Site não utiliza ferramentas de análise de tráfego (analytics), não regista o
            comportamento de navegação e não cria perfis de utilizador.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">3. Finalidade e fundamento jurídico</h2>
          <p className="text-muted-foreground">
            Os dados são tratados exclusivamente para responder a pedidos de informação, gerir a
            actividade institucional do núcleo e divulgar as suas iniciativas. O fundamento
            jurídico é o consentimento do titular (art. 6.º, n.º 1, al. a) do RGPD) ao submeter
            voluntariamente o formulário ou ao iniciar contacto.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">4. Cookies e serviços de terceiros</h2>
          <p className="text-muted-foreground mb-3">
            O Site não coloca cookies próprios de rastreamento. São, no entanto, incorporados
            serviços de terceiros que podem definir cookies técnicos ou registar o endereço IP do
            visitante para efeitos de funcionamento:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>
              <strong className="text-foreground">Google Maps</strong> — mapas interactivos das
              instalações e actividades. Sujeito à{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground hover:text-accent transition-colors underline underline-offset-4"
              >
                política de privacidade da Google
              </a>
              .
            </li>
            <li>
              <strong className="text-foreground">Google Calendar</strong> — visualização do
              calendário de eventos do núcleo.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">5. Conservação dos dados</h2>
          <p className="text-muted-foreground">
            As mensagens de correio electrónico recebidas são conservadas pelo tempo necessário ao
            seu tratamento e enquanto a relação institucional o justifique, sendo posteriormente
            eliminadas ou arquivadas de forma anonimizada.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">6. Partilha de dados</h2>
          <p className="text-muted-foreground">
            O NFIST não vende, aluga nem transmite dados pessoais a terceiros. Dados poderão ser
            partilhados apenas com os órgãos competentes do Instituto Superior Técnico ou da
            Universidade de Lisboa quando tal seja necessário à prossecução das actividades
            institucionais, ou quando exigido por lei.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">7. Direitos do titular</h2>
          <p className="text-muted-foreground mb-3">
            Nos termos do RGPD, o titular dos dados tem direito a:
          </p>
          <ul className="space-y-1.5 text-muted-foreground list-disc pl-5">
            <li>Aceder aos seus dados pessoais;</li>
            <li>Solicitar a rectificação de dados incorrectos ou incompletos;</li>
            <li>Solicitar o apagamento dos dados (&ldquo;direito ao esquecimento&rdquo;);</li>
            <li>Solicitar a limitação ou opor-se ao tratamento;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>Retirar o consentimento previamente concedido, a qualquer momento.</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            Estes direitos podem ser exercidos através de pedido escrito para{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-foreground hover:text-accent transition-colors"
            >
              {SITE.email}
            </a>
            . Assiste ainda o direito de apresentar reclamação junto da Comissão Nacional de
            Protecção de Dados (CNPD).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">8. Alterações à política</h2>
          <p className="text-muted-foreground">
            O NFIST reserva-se o direito de actualizar esta política sempre que necessário. A
            versão em vigor está disponível permanentemente nesta página, com indicação da data da
            última revisão.
          </p>
        </section>
      </article>
    </>
  );
}
