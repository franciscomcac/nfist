import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type FieldDef } from "@/components/admin/crud-manager";

export const Route = createFileRoute("/_authenticated/admin/eventos")({
  component: EventosAdmin,
});

const fields: FieldDef[] = [
  {
    key: "name",
    label: "Nome do evento",
    kind: "text",
    help: "Aparece como título grande na página do evento e nas listagens. Ex.: Semana da Física",
  },
  {
    key: "eyebrow",
    label: "Sobre-título",
    kind: "text",
    help: "Texto pequeno que aparece por cima do nome. Serve para categorizar. Ex.: Evento principal",
  },
  {
    key: "short",
    label: "Descrição curta",
    kind: "textarea",
    help: "Uma frase ou duas que descrevem o evento. Aparece nos cartões e no início da página.",
  },
  {
    key: "hero_url",
    label: "Imagem principal",
    kind: "image",
    help: "A imagem grande no topo da página do evento. Recomendado: formato horizontal, mínimo 1600×900.",
  },
  {
    key: "gallery",
    label: "Galeria de fotos",
    kind: "gallery",
    help: "Fotos adicionais mostradas em galeria. Pode arrastar várias de uma só vez.",
  },
  {
    key: "period",
    label: "Quando acontece",
    kind: "text",
    help: "Período em que o evento se realiza, em texto livre. Ex.: Anual · Primavera, ou Março 2026",
  },
  {
    key: "location",
    label: "Onde acontece",
    kind: "text",
    help: "Local principal. Ex.: Campus Alameda, IST",
  },
  {
    key: "description",
    label: "Descrição completa",
    kind: "paragraphs",
    help: "Um parágrafo por bloco de texto. Adicione tantos quantos precisar.",
  },
  {
    key: "programme",
    label: "Programa",
    kind: "titlebody",
    labels: { a: "Nome da actividade", b: "Descrição" },
    help: "Lista de actividades ou momentos do evento. Cada linha tem um título e uma descrição.",
  },
  {
    key: "info",
    label: "Informação prática",
    kind: "keyvalue",
    labels: { a: "Etiqueta (ex.: Duração)", b: "Valor (ex.: 5 dias)" },
    help: "Detalhes práticos apresentados em tabela. Ex.: Duração / 5 dias, Público / Estudantes.",
  },
  {
    key: "section_slug",
    label: "Secção associada",
    kind: "section",
    help: "Se o evento pertence a uma secção do NFIST, selecione-a aqui.",
  },
  {
    key: "featured",
    label: "Destacar na página inicial",
    kind: "boolean",
    help: "Se activado, o evento aparece com destaque na secção de eventos.",
  },
  {
    key: "published",
    label: "Publicado (visível ao público)",
    kind: "boolean",
    help: "Desactive para esconder temporariamente sem eliminar.",
  },
  // Advanced
  {
    key: "slug",
    label: "Slug (URL)",
    kind: "text",
    advanced: true,
    help: "Identificador na URL, sem espaços nem acentos. Ex.: semana-da-fisica → /eventos/semana-da-fisica",
  },
  {
    key: "category",
    label: "Categoria interna",
    kind: "text",
    advanced: true,
    help: "Usado para agrupar. Valores: principal, recorrente, ou especial.",
  },
  {
    key: "event_date",
    label: "Data específica",
    kind: "date",
    advanced: true,
    help: "Opcional. Usada para ordenar cronologicamente.",
  },
  {
    key: "sort_order",
    label: "Ordem manual",
    kind: "number",
    advanced: true,
    help: "Número mais baixo aparece primeiro. Use 0 se não quiser fixar.",
  },
];

function EventosAdmin() {
  return (
    <CrudManager
      title="Eventos e Programas"
      intro="Adicione ou edite eventos do NFIST. Os campos essenciais estão em cima; detalhes técnicos ficam em ‘Opções avançadas’."
      table="events"
      pk="slug"
      uploadFolder="events"
      orderBy={{ column: "sort_order" }}
      fields={fields}
      listColumns={[
        { key: "name", label: "Nome" },
        { key: "period", label: "Quando" },
        { key: "featured", label: "Destaque" },
        { key: "published", label: "Publicado" },
      ]}
      emptyRow={() => ({
        slug: "",
        name: "",
        eyebrow: "",
        category: "recorrente",
        period: "",
        location: "",
        short: "",
        hero_url: null,
        gallery: [],
        description: [],
        programme: [],
        info: [],
        locations: [],
        section_slug: null,
        event_date: null,
        featured: false,
        published: true,
        sort_order: 0,
      })}
    />
  );
}
