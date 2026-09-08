export type RepoItem = {
  id: string;
  title: string;
  type: "PDF" | "Vídeo" | "Artigo" | "Apontamentos" | "Revista";
  topic: string;
  author: string;
  date: string;
  href: string;
};

export const REPOSITORY: RepoItem[] = [
  { id: "1", title: "Pulsar — Edição Primavera 2025", type: "Revista", topic: "Divulgação", author: "Pulsar", date: "2025-04", href: "#" },
  { id: "2", title: "Apontamentos de Mecânica Clássica (MEFT 1º ano)", type: "Apontamentos", topic: "Mecânica", author: "Repositório MEFT", date: "2025-02", href: "#" },
  { id: "3", title: "Watt's Beyond · Ep. 07 — Buracos negros", type: "Vídeo", topic: "Astrofísica", author: "Info", date: "2025-01", href: "#" },
  { id: "4", title: "Guia de instrumentação para observação nocturna", type: "PDF", topic: "Astronomia", author: "Astro", date: "2024-11", href: "#" },
  { id: "5", title: "Relatório Estrelas Sobre o Atlântico — Açores 2024", type: "PDF", topic: "Divulgação", author: "NFIST", date: "2024-06", href: "#" },
  { id: "6", title: "Introdução à Física Quântica — notas de leitura", type: "Apontamentos", topic: "Quântica", author: "Repositório MEFT", date: "2024-05", href: "#" },
  { id: "7", title: "Pulsar — Edição Outono 2024", type: "Revista", topic: "Divulgação", author: "Pulsar", date: "2024-10", href: "#" },
  { id: "8", title: "Experiências do Circo — manual de montagem", type: "PDF", topic: "Experimental", author: "Circo da Física", date: "2024-03", href: "#" },
  { id: "9", title: "Astrofotografia com câmara DSLR — workshop", type: "Vídeo", topic: "Astronomia", author: "Astro", date: "2024-02", href: "#" },
  { id: "10", title: "Termodinâmica — resumos de exame", type: "Apontamentos", topic: "Termodinâmica", author: "Repositório MEFT", date: "2023-12", href: "#" },
  { id: "11", title: "Relatório JEF 2023", type: "PDF", topic: "Institucional", author: "NFIST", date: "2023-11", href: "#" },
  { id: "12", title: "Electromagnetismo — problemas resolvidos", type: "Apontamentos", topic: "Electromagnetismo", author: "Repositório MEFT", date: "2023-09", href: "#" },
];
