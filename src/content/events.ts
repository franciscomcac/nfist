export type EventCategory = "principal" | "recorrente" | "especial";

export type NFEvent = {
  slug: string;
  name: string;
  eyebrow: string;
  category: EventCategory;
  period: string;
  location: string;
  short: string;
  hero: string;
  gallery?: string[];
  description: string[];
  programme?: { title: string; body: string }[];
  info?: { label: string; value: string }[];
  locations?: string[];
  featured?: boolean;
};

export const EVENTS: NFEvent[] = [
  {
    slug: "semana-da-fisica",
    name: "Semana da Física",
    eyebrow: "Evento principal",
    category: "principal",
    period: "Anual · Primavera",
    location: "Campus Alameda, IST",
    short:
      "Uma semana no IST que traz milhares de estudantes de todo o país ao contacto directo com a Física — laboratórios, planetário, palestras e o Circo da Física.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/eventos/SF/sf-main.png",
    gallery: [
      "https://nfist.tecnico.ulisboa.pt/media/photos/NFIST-bg.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/photos/pacman.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/photos/meet-greet.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/photos/image.png",
      "https://nfist.tecnico.ulisboa.pt/media/grupos/circo/circo-bg.JPG",
    ],
    description: [
      "A Semana da Física é o principal evento científico e pedagógico do NFIST. Todos os anos traz milhares de estudantes do ensino básico e secundário ao campus do Instituto Superior Técnico, num contacto directo e envolvente com o mundo da Física.",
      "O objectivo é despertar o interesse pela ciência através de uma abordagem prática e interativa — os participantes exploram fenómenos físicos, colocam questões, experimentam e compreendem o papel da Física no quotidiano e no desenvolvimento tecnológico.",
      "O destaque do evento é o Circo da Física — um conjunto de experiências e demonstrações interativas dinamizadas por estudantes do IST. Além disso, o programa inclui sessões de planetário, visitas a laboratórios de investigação, palestras e workshops.",
    ],
    programme: [
      { title: "Circo da Física", body: "Bancas demonstrativas conduzidas pelos estudantes do IST." },
      { title: "Sessões de planetário", body: "Programa de astronomia e cosmologia para grupos escolares." },
      { title: "Laboratórios de investigação", body: "Visitas guiadas a laboratórios activos do Departamento de Física." },
      { title: "Palestras", body: "Comunicações curtas de investigadores e docentes." },
    ],
    info: [
      { label: "Público-alvo", value: "Ensino básico e secundário" },
      { label: "Duração", value: "5 dias" },
      { label: "Local", value: "IST — Campus Alameda" },
      { label: "Organização", value: "NFIST · Circo da Física" },
    ],
    featured: true,
  },
  {
    slug: "jornadas-engenharia-fisica",
    name: "Jornadas de Engenharia Física",
    eyebrow: "Evento anual · JEF",
    category: "recorrente",
    period: "Anual",
    location: "IST — Alameda",
    short: "Palestras, workshops e networking que aproximam estudantes de Engenharia Física do mundo académico e empresarial.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/logos/JEF-logo.jpg",
    gallery: ["https://nfist.tecnico.ulisboa.pt/media/photos/meet-greet.JPG"],
    description: [
      "As Jornadas de Engenharia Física (JEF) são um programa anual organizado por estudantes do NFIST para aproximar alunos do mundo académico e empresarial — com palestras, workshops e momentos estruturados de networking.",
      "O programa procura ajudar estudantes a explorar saídas profissionais, temas actuais da Física e competências úteis para o mercado de trabalho.",
    ],
    programme: [
      { title: "Palestras", body: "Conversas com investigadores, alumni e profissionais da indústria." },
      { title: "Workshops", body: "Sessões práticas em temas técnicos e de soft skills." },
      { title: "Meet & Greet", body: "Contacto directo entre estudantes e convidados." },
    ],
    info: [
      { label: "Público-alvo", value: "Alunos de Engenharia Física, Física e áreas afins" },
      { label: "Periodicidade", value: "Anual" },
      { label: "Local", value: "IST — Alameda" },
      { label: "Formato", value: "Palestras e workshops" },
    ],
  },
  {
    slug: "escola-de-verao-de-astronomia",
    name: "Escola de Verão de Astronomia",
    eyebrow: "EVA · Programa de Verão",
    category: "recorrente",
    period: "Julho · 5 dias",
    location: "IST — Lisboa",
    short: "Programa de cinco dias para alunos do ensino secundário: palestras, workshops de instrumentação e observações nocturnas guiadas pela Astro.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/astro/eva25-7.jpg",
    gallery: [
      "https://nfist.tecnico.ulisboa.pt/media/eventos/EVA/team.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/grupos/astro/astro-bg.JPG",
    ],
    description: [
      "A EVA — Escola de Verão de Astronomia é um programa de vários dias para alunos do Ensino Secundário que querem aprender Astronomia de forma prática, com palestras, workshops, observações nocturnas e atividades guiadas pela secção Astro.",
      "A escola equilibra conteúdos introdutórios e actividades práticas para dar uma experiência completa de Astronomia e Astrofísica.",
    ],
    programme: [
      { title: "Palestras", body: "Evolução estelar, cosmologia, exploração espacial — em linguagem acessível." },
      { title: "Workshops", body: "Observação, uso de telescópios e noções de astrofotografia para iniciantes." },
      { title: "Observações nocturnas", body: "Noites dedicadas ao céu profundo e reconhecimento de constelações." },
    ],
    info: [
      { label: "Público-alvo", value: "Ensino secundário" },
      { label: "Duração", value: "5 dias" },
      { label: "Local", value: "IST — Lisboa" },
      { label: "Contacto", value: "astro.nfist@gmail.com" },
    ],
  },
  {
    slug: "fisica-sobre-rodas",
    name: "Física sobre Rodas",
    eyebrow: "Exposição itinerante",
    category: "recorrente",
    period: "Julho · anual",
    location: "Escolas, feiras e eventos públicos",
    short: "Exposição itinerante que percorre Portugal continental levando o Circo da Física a comunidades sem acesso regular a divulgação científica.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/circo/circo-bg.JPG",
    gallery: ["https://nfist.tecnico.ulisboa.pt/media/photos/pacman.JPG"],
    description: [
      "A Física sobre Rodas é uma exposição interativa de física que viaja pelo país todos os anos, levando conhecimento através de experiências e observações a diferentes regiões do território continental. O objectivo é divulgar a Física de forma dinâmica, atractiva e acessível a toda a comunidade.",
      "É também uma oportunidade para os colaboradores do NFIST partilharem o seu interesse pela área e desenvolverem as suas competências de comunicação científica.",
      "Na edição de 2025, o projecto passou pelos municípios de Estarreja, Fafe, Mondim de Basto, Murtosa, Vila Flor, Vila Real e Viana do Castelo, entre 16 e 26 de Julho.",
    ],
    info: [
      { label: "Periodicidade", value: "Anual" },
      { label: "Duração típica", value: "10 dias" },
      { label: "Formato", value: "Feira pública de experiências" },
      { label: "Entrada", value: "Gratuita" },
    ],
    locations: ["Viana do Castelo", "Fafe", "Mondim de Basto", "Vila Real", "Vila Flor", "Estarreja", "Murtosa"],
  },
  {
    slug: "estrelas-sobre-o-atlantico",
    name: "Estrelas Sobre o Atlântico",
    eyebrow: "Projeto especial · ESA",
    category: "especial",
    period: "Fevereiro · bienal",
    location: "Açores · Madeira",
    short: "Projecto de divulgação científica que leva o NFIST a comunidades insulares — Circo da Física, planetário móvel e observações solares.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/eventos/ESA/ESA-main.JPG",
    gallery: ["https://nfist.tecnico.ulisboa.pt/media/grupos/astro/eva25-7.jpg"],
    description: [
      "O Estrelas Sobre o Atlântico é um projecto de divulgação científica que leva o NFIST a comunidades insulares, aproximando a ciência de públicos que nem sempre têm acesso regular a este tipo de iniciativas.",
      "Reúne experiências do Circo da Física, sessões da Astro com planetário móvel e observações solares e nocturnas, numa abordagem interativa e inclusiva.",
      "A primeira edição decorreu entre 4 e 10 de Fevereiro de 2024, nas ilhas Terceira e São Miguel, com sessões em escolas, infantários, centros de atividades de tempos livres e instituições de solidariedade social — cerca de 800 participantes.",
      "A segunda edição decorreu entre 11 e 16 de Fevereiro de 2026, com atividades em escolas do Funchal, Calheta e Machico, e uma Feira da Ciência em parceria com o Museu de História Natural do Funchal e o Departamento de Física da Universidade da Madeira.",
    ],
    info: [
      { label: "Edições", value: "Açores 2024 · Madeira 2026" },
      { label: "Participantes", value: "≈ 800 (Açores)" },
      { label: "Formato", value: "Planetário móvel + Circo da Física" },
      { label: "Cobertura", value: "RTP Açores · RTP Madeira" },
    ],
  },
];

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}
