export const SITE = {
  name: "NFIST",
  fullName: "Núcleo de Física do Instituto Superior Técnico",
  parent: "Universidade de Lisboa",
  tagline: "A promover a investigação em física. A comunicar ciência à nação.",
  email: "nfist@tecnico.ulisboa.pt",
  address: {
    line1: "Instituto Superior Técnico",
    line2: "Av. Rovisco Pais 1",
    line3: "1049-001 Lisboa · Portugal",
  },
  social: {
    instagram: "https://www.instagram.com/nfist/",
    tiktok: "https://www.tiktok.com/@nucleofisicaist",
    facebook: "https://www.facebook.com/NucleoFisicaIST",
    youtube: "https://www.youtube.com/user/NucleoFisicaIST",
    linkedin: "https://www.linkedin.com/company/nfist",
  },
  logoWhite: "https://nfist.tecnico.ulisboa.pt/media/logos/nfist-logo-white.png",
};

export const NAV = [
  { to: "/seccoes", label: "Secções" },
  { to: "/eventos", label: "Eventos e Programas" },
  { to: "/repositorio", label: "Repositório" },
  { to: "/calendario", label: "Calendário" },
  { to: "/contactos", label: "Contactos" },
] as const;

export const STATS = [
  { value: "30+", label: "Anos de actividade" },
  { value: "5 000+", label: "Alunos alcançados pela Semana da Física" },
  { value: "20+", label: "Iniciativas por ano lectivo" },
  { value: "5", label: "Secções de investigação e divulgação" },
];
