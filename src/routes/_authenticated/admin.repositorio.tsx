import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type FieldDef } from "@/components/admin/crud-manager";

export const Route = createFileRoute("/_authenticated/admin/repositorio")({
  component: RepoAdmin,
});

const fields: FieldDef[] = [
  {
    key: "title",
    label: "Título",
    kind: "text",
    help: "Nome do documento tal como aparece na lista pública.",
  },
  {
    key: "type",
    label: "Tipo",
    kind: "text",
    help: "Como classificar o conteúdo. Ex.: PDF, Vídeo, Artigo, Apontamentos, Revista.",
  },
  {
    key: "author",
    label: "Autor(es)",
    kind: "text",
    help: "Quem escreveu ou produziu. Pode ser uma pessoa, várias, ou um grupo.",
  },
  {
    key: "topic",
    label: "Tema",
    kind: "text",
    help: "Assunto principal em uma palavra ou frase curta. Ex.: Astrofísica, Comunicação de Ciência.",
  },
  {
    key: "item_date",
    label: "Data (Ano-Mês)",
    kind: "text",
    placeholder: "2024-03",
    help: "Ano e mês em que foi publicado. Formato: AAAA-MM. Ex.: 2024-03",
  },
  {
    key: "file_url",
    label: "Ficheiro",
    kind: "file",
    help: "Carregue aqui o PDF, DOCX ou outro ficheiro. Fica disponível para descarga pública.",
  },
  {
    key: "href",
    label: "Ou: link externo",
    kind: "url",
    help: "Se em vez de ficheiro quiser apontar para um site externo (YouTube, revista online), cole o URL aqui.",
  },
  {
    key: "section_slug",
    label: "Secção associada",
    kind: "section",
    help: "Opcional: liga este documento a uma secção do NFIST.",
  },
  {
    key: "published",
    label: "Publicado (visível ao público)",
    kind: "boolean",
    help: "Desactive para esconder temporariamente sem eliminar.",
  },
  {
    key: "sort_order",
    label: "Ordem manual",
    kind: "number",
    advanced: true,
    help: "Número mais baixo aparece primeiro. Use 0 se não quiser fixar.",
  },
];

function RepoAdmin() {
  return (
    <CrudManager
      title="Repositório"
      intro="Adicione documentos, revistas e apontamentos. Pode carregar um ficheiro directamente OU indicar um link externo — não é necessário ambos."
      table="repository_items"
      pk="id"
      uploadFolder="repository"
      orderBy={{ column: "sort_order" }}
      fields={fields}
      listColumns={[
        { key: "title", label: "Título" },
        { key: "type", label: "Tipo" },
        { key: "author", label: "Autor" },
        { key: "item_date", label: "Data" },
      ]}
      emptyRow={() => ({
        title: "",
        type: "PDF",
        topic: "",
        author: "",
        item_date: "",
        href: "",
        file_url: "",
        section_slug: null,
        published: true,
        sort_order: 0,
      })}
    />
  );
}
