export type Division = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  short: string;
  hero: string;
  gallery?: string[];
  about: string[];
  activities: { title: string; body: string }[];
  participation: string[];
  relatedEvents?: string[];
};

export const DIVISIONS: Division[] = [
  {
    slug: "circo",
    name: "Circo da Física",
    eyebrow: "Divulgação",
    tagline: "Demonstrações e ciência experimental para todos os públicos.",
    short:
      "Bancas demonstrativas, workshops itinerantes e mediação em escolas e eventos públicos.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/circo/circo-bg.JPG",
    gallery: [
      "https://nfist.tecnico.ulisboa.pt/media/grupos/circo/team.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/photos/pacman.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/eventos/SF/sf-main.png",
    ],
    about: [
      "O Circo da Física é a secção do NFIST dedicada à divulgação científica através de exposições interativas. Levamos experiências e demonstrações a escolas, feiras e ao público em geral, mostrando como a Física explica fenómenos do quotidiano.",
      "É a face mais visível do núcleo: um laboratório itinerante que combina rigor experimental com uma linguagem acessível a qualquer idade.",
    ],
    activities: [
      { title: "Exposições interativas", body: "Bancas demonstrativas com experiências simples e visuais que qualquer pessoa pode explorar em contacto directo." },
      { title: "Divulgação em escolas", body: "Visitas a escolas do país, com sessões adaptadas a diferentes ciclos e programas curriculares." },
      { title: "Workshops e atividades", body: "Sessões temáticas e actividades práticas conduzidas por estudantes do IST em ambiente informal." },
    ],
    participation: [
      "Demonstrações experimentais",
      "Montagem e logística",
      "Divulgação em escolas",
      "Mediação com o público",
      "Concepção de novas atividades",
    ],
    relatedEvents: ["semana-da-fisica", "fisica-sobre-rodas", "estrelas-sobre-o-atlantico"],
  },
  {
    slug: "astro",
    name: "Astro",
    eyebrow: "Astronomia",
    tagline: "Observação astronómica, astrofísica e divulgação do céu profundo.",
    short:
      "Saídas de observação, workshops de instrumentação, astrofotografia e sessões públicas de planetário.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/astro/astro-bg.JPG",
    gallery: ["https://nfist.tecnico.ulisboa.pt/media/grupos/astro/eva25-7.jpg"],
    about: [
      "A Astro é a secção do NFIST dedicada à Astronomia, Astrofísica e Astrofotografia. Entre saídas de observação, workshops, palestras e actividades para escolas, procuramos aproximar o céu nocturno de quem o quer explorar com curiosidade e rigor.",
      "Desde os seus primórdios, a humanidade contempla as estrelas com fascínio. Na Astro trabalhamos para recuperar essa ligação ao céu — e para partilhá-la com a comunidade através de programas estruturados de formação e observação.",
    ],
    activities: [
      { title: "Observação e astrofotografia", body: "Saídas para locais com melhores condições de céu escuro, introdução à observação e ao processamento de imagem astronómica." },
      { title: "Palestras e workshops", body: "Formação em áreas das ciências do espaço — da física matemática à astrobiologia, da astrofísica teórica à instrumentação." },
      { title: "Escolas e divulgação", body: "Sessões de planetário móvel, observação solar, montagem de telescópios e atividades adaptadas a diferentes idades." },
    ],
    participation: [
      "Saídas de observação",
      "Astrofotografia e processamento",
      "Palestras e conteúdo técnico",
      "Instrumentação e telescópios",
      "Divulgação em escolas",
    ],
    relatedEvents: ["escola-de-verao-de-astronomia", "estrelas-sobre-o-atlantico"],
  },
  {
    slug: "pulsar",
    name: "Pulsar",
    eyebrow: "Publicação",
    tagline: "Revista semestral de divulgação científica.",
    short:
      "Artigos de divulgação, entrevistas com investigadores e peças sobre investigação em Física — em linguagem acessível.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/pulsar/pulsar-bg.JPG",
    gallery: ["https://nfist.tecnico.ulisboa.pt/media/grupos/pulsar/team.JPG"],
    about: [
      "A Pulsar é a revista semestral do NFIST. Publicamos artigos de divulgação científica, explicações de experiências, entrevistas e peças sobre investigação em Física — sempre em linguagem cuidada e curiosa.",
      "A publicação é editada por estudantes, com processos próprios de revisão, paginação e design, e distribuída na comunidade do IST e além dela.",
    ],
    activities: [
      { title: "Artigos de divulgação", body: "Textos sobre Física moderna, experiências marcantes e curiosidades científicas." },
      { title: "Entrevistas", body: "Conversas com investigadores, docentes e convidados sobre ciência e percurso académico." },
      { title: "Edições anuais", body: "Produção editorial completa: escrita, revisão, design e publicação da revista." },
    ],
    participation: ["Redação", "Revisão editorial", "Entrevistas", "Design e paginação", "Coordenação de edição"],
    relatedEvents: [],
  },
  {
    slug: "recreativa",
    name: "ReCreativa",
    eyebrow: "Comunidade",
    tagline: "Vida académica, integração e cultura científica estudantil.",
    short: "Convívios, actividades culturais e programas de integração para a comunidade do NFIST.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/recreativa/recreativa-bg.JPG",
    gallery: [
      "https://nfist.tecnico.ulisboa.pt/media/grupos/recreativa/team.JPG",
      "https://nfist.tecnico.ulisboa.pt/media/photos/nfist-bolo.JPG",
    ],
    about: [
      "A ReCreativa é a secção do NFIST dedicada ao lazer, convívio e integração entre estudantes, promovendo um ambiente próximo e activo dentro da comunidade do IST.",
      "É o tecido humano do núcleo: garante que o trabalho científico e de divulgação assenta numa comunidade coesa e viva.",
    ],
    activities: [
      { title: "Lazer e convívio", body: "Momentos descontraídos ao longo do semestre para fortalecer a comunidade." },
      { title: "Atividades culturais", body: "Saídas culturais, visitas e iniciativas fora do contexto académico." },
      { title: "Jantares e passeios", body: "Almoços, jantares de curso e passeios que criam espírito de grupo." },
      { title: "Jogos e competições", body: "Torneios e desafios lúdicos — tabuleiro, desporto, quizzes." },
    ],
    participation: ["Programação de atividades", "Logística e produção", "Integração de novos alunos", "Comunicação", "Parcerias e convívios"],
    relatedEvents: [],
  },
  {
    slug: "info",
    name: "Info",
    eyebrow: "Tecnologia",
    tagline: "Comunicações digitais, produção multimédia e infraestrutura.",
    short: "Website, bases de dados, apoio técnico às secções, newsletter PhysikUPDATE e podcast Watt's Beyond.",
    hero: "https://nfist.tecnico.ulisboa.pt/media/grupos/info/info-bg.JPG",
    gallery: ["https://nfist.tecnico.ulisboa.pt/media/grupos/info/team.JPG"],
    about: [
      "A Info é a secção do NFIST dedicada à gestão tecnológica e informativa do núcleo. Mantemos a infra-estrutura digital, bases de dados e ajudamos a comunidade MEFT com oportunidades académicas e profissionais.",
      "É também a equipa por trás das comunicações digitais — a newsletter PhysikUPDATE, o podcast Watt's Beyond e a presença nas plataformas do núcleo.",
    ],
    activities: [
      { title: "Website e infraestrutura", body: "Gestão e actualização do site do NFIST e recursos digitais associados." },
      { title: "Bases de dados", body: "Organização de informação interna: membros, actividades e histórico do núcleo." },
      { title: "Oportunidades MEFT", body: "Divulgação de estágios, bolsas, programas internacionais e oportunidades profissionais." },
      { title: "Apoio técnico", body: "Suporte informático às secções para eventos, inscrições e comunicação." },
      { title: "Comunicação digital", body: "Automatizações, newsletters e ferramentas para aproximar o NFIST da comunidade." },
    ],
    participation: ["Website e frontend", "Infraestrutura digital", "Bases de dados", "Apoio técnico a eventos", "Automação e ferramentas internas"],
    relatedEvents: [],
  },
];

export function getDivision(slug: string) {
  return DIVISIONS.find((d) => d.slug === slug);
}
