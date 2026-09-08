export type CalendarEvent = {
  date: string;
  title: string;
  location: string;
  time?: string;
  eventSlug?: string;
};

export const CALENDAR: CalendarEvent[] = [
  { date: "2026-02-11", title: "Estrelas Sobre o Atlântico — Madeira", location: "Funchal, Calheta e Machico", eventSlug: "estrelas-sobre-o-atlantico" },
  { date: "2026-03-16", title: "Semana da Física 2026", location: "IST — Campus Alameda", time: "09:00", eventSlug: "semana-da-fisica" },
  { date: "2026-04-08", title: "Sessão de observação Astro", location: "Serra da Estrela", time: "21:30" },
  { date: "2026-04-22", title: "Pulsar — lançamento edição Primavera", location: "IST — Anfiteatro PA1", time: "18:00" },
  { date: "2026-05-14", title: "Jornadas de Engenharia Física", location: "IST — Alameda", time: "10:00", eventSlug: "jornadas-engenharia-fisica" },
  { date: "2026-07-20", title: "Física sobre Rodas — arranque itinerância", location: "Vila Real", eventSlug: "fisica-sobre-rodas" },
  { date: "2026-07-27", title: "Escola de Verão de Astronomia", location: "IST — Lisboa", eventSlug: "escola-de-verao-de-astronomia" },
];
