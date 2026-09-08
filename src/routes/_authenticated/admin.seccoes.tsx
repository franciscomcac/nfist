import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type FieldDef } from "@/components/admin/crud-manager";

export const Route = createFileRoute("/_authenticated/admin/seccoes")({
  component: SeccoesAdmin,
});

const fields: FieldDef[] = [
  {
    key: "name",
    label: "Nome da secção",
    kind: "text",
    help: "Ex.: Circo da Física, AstroClube, Pulsar.",
  },
  {
    key: "eyebrow",
    label: "Sobre-título",
    kind: "text",
    help: "Categorização curta que aparece por cima do nome. Ex.: Divulgação, Investigação estudantil.",
  },
  {
    key: "tagline",
    label: "Frase de apresentação",
    kind: "text",
    help: "Uma frase memorável que sintetize a missão da secção.",
  },
  {
    key: "short",
    label: "Descrição curta",
    kind: "textarea",
    help: "Uma ou duas frases para resumir o que a secção faz. Aparece nos cartões e listagens.",
  },
  {
    key: "hero_url",
    label: "Imagem principal",
    kind: "image",
    help: "Imagem grande no topo da página da secção. Formato horizontal, mínimo 1600×900.",
  },
  {
    key: "about",
    label: "Sobre a secção",
    kind: "paragraphs",
    help: "Texto institucional dividido em parágrafos. Adicione um por bloco.",
  },
  {
    key: "activities",
    label: "Actividades",
    kind: "titlebody",
    labels: { a: "Nome da actividade", b: "Descrição" },
    help: "Lista de actividades regulares ou projectos que a secção desenvolve.",
  },
  {
    key: "participation",
    label: "Como participar",
    kind: "paragraphs",
    help: "Instruções para quem queira juntar-se. Um bloco por passo ou parágrafo.",
  },
  {
    key: "gallery",
    label: "Galeria de fotos",
    kind: "gallery",
    help: "Fotos ilustrativas da secção. Pode arrastar várias de uma só vez.",
  },
  {
    key: "related_events",
    label: "Eventos relacionados",
    kind: "tags",
    placeholder: "slug-do-evento",
    help: "Slugs dos eventos ligados à secção. Escreva cada slug e prima Enter.",
  },
  {
    key: "slug",
    label: "Slug (URL)",
    kind: "text",
    advanced: true,
    help: "Identificador na URL, sem espaços nem acentos. Ex.: circo → /seccoes/circo",
  },
  {
    key: "sort_order",
    label: "Ordem manual",
    kind: "number",
    advanced: true,
    help: "Número mais baixo aparece primeiro.",
  },
];

function SeccoesAdmin() {
  return (
    <CrudManager
      title="Secções"
      intro="Edite as páginas institucionais de cada secção do NFIST. Os campos essenciais estão em cima; detalhes técnicos ficam em ‘Opções avançadas’."
      table="sections"
      pk="slug"
      uploadFolder="sections"
      orderBy={{ column: "sort_order" }}
      fields={fields}
      listColumns={[
        { key: "name", label: "Nome" },
        { key: "eyebrow", label: "Categoria" },
        { key: "sort_order", label: "Ordem" },
      ]}
      emptyRow={() => ({
        slug: "",
        name: "",
        eyebrow: "",
        tagline: "",
        short: "",
        hero_url: null,
        about: [],
        activities: [],
        participation: [],
        gallery: [],
        related_events: [],
        sort_order: 0,
      })}
    />
  );
}
