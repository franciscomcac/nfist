import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StaggerChildren } from "@/components/reveal";
import { CALENDAR } from "@/content/calendar";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário — NFIST" },
      {
        name: "description",
        content: "Agenda de eventos, observações e programas do NFIST para o ano lectivo em curso.",
      },
      { property: "og:title", content: "Calendário — NFIST" },
      { property: "og:description", content: "Agenda do NFIST." },
      { property: "og:url", content: "/calendario" },
    ],
    links: [{ rel: "canonical", href: "/calendario" }],
  }),
  component: CalendarPage,
});

const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const WEEKDAYS = ["S", "T", "Q", "Q", "S", "S", "D"]; // Mon-Sun

/** How long an event lingers in the list after it happens. */
const EXPIRES_AFTER_DAYS = 3;

const pad = (n: number) => String(n).padStart(2, "0");
const monthKeyOf = (iso: string) => iso.slice(0, 7);

function CalendarPage() {
  // The list reads as the primary view, so it is what loads first.
  const [view, setView] = useState<"lista" | "mes">("lista");
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Resolved once, on the client. The page body is not server-rendered, so
  // there is no hydration mismatch to worry about here.
  const [clock] = useState(() => {
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - EXPIRES_AFTER_DAYS);
    const iso = (d: Date) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    return { today: iso(today), cutoff: iso(cutoff) };
  });

  const monthKey = cursor.getFullYear() + "-" + pad(cursor.getMonth() + 1);
  const eventsThisMonth = CALENDAR.filter((e) => e.date.startsWith(monthKey));

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startWeekday = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: { day: number | null; date?: string; hasEvent?: boolean }[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = cursor.getFullYear() + "-" + pad(cursor.getMonth() + 1) + "-" + pad(d);
      cells.push({ day: d, date: iso, hasEvent: CALENDAR.some((e) => e.date === iso) });
    }
    return cells;
  }, [cursor]);

  // Soonest first, ties broken by start time.
  const chronological = useMemo(
    () =>
      [...CALENDAR].sort((a, b) => {
        const byDate = a.date.localeCompare(b.date);
        return byDate !== 0 ? byDate : (a.time ?? "").localeCompare(b.time ?? "");
      }),
    [],
  );

  // An event drops off the list once it is more than EXPIRES_AFTER_DAYS old,
  // so the agenda never turns into an archive of things already gone.
  const listed = useMemo(() => chronological.filter((e) => e.date >= clock.cutoff), [chronological, clock]);

  return (
    <>
      <header className="container-page pt-24 md:pt-32 pb-6 md:pb-8 border-b border-hairline">
        <div className="eyebrow mb-3">Agenda</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl">Calendário</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Eventos, sessões de observação, lançamentos editoriais e programas itinerantes do NFIST.
        </p>
      </header>

      <section className="container-page py-10 flex items-center justify-between border-b border-hairline gap-4 flex-wrap">
        <div className="inline-flex border border-hairline">
          <button
            onClick={() => setView("lista")}
            className={
              "px-4 h-9 text-xs font-mono uppercase tracking-wider transition-colors " +
              (view === "lista" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")
            }
          >
            Lista
          </button>
          <button
            onClick={() => setView("mes")}
            className={
              "px-4 h-9 text-xs font-mono uppercase tracking-wider border-l border-hairline transition-colors " +
              (view === "mes" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")
            }
          >
            Mês
          </button>
        </div>

        {view === "mes" && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="h-9 w-9 border border-hairline transition-colors hover:bg-surface"
              aria-label="Mês anterior"
            >
              ←
            </button>
            <div className="font-serif text-lg sm:text-xl min-w-[140px] sm:min-w-[180px] text-center">
              {MONTHS_PT[cursor.getMonth()]} {cursor.getFullYear()}
            </div>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="h-9 w-9 border border-hairline transition-colors hover:bg-surface"
              aria-label="Mês seguinte"
            >
              →
            </button>
          </div>
        )}
      </section>
      <section className="container-page py-10 md:py-16">
        {view === "mes" ? (
          <div className="grid md:grid-cols-[2fr_1fr] gap-10 md:gap-12">
            <div>
              <div className="grid grid-cols-7 border-t border-l border-hairline">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={i}
                    className="border-b border-r border-hairline p-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground text-center"
                  >
                    {d}
                  </div>
                ))}
                {grid.map((c, i) => (
                  <div
                    key={i}
                    className={
                      "border-b border-r border-hairline aspect-square p-2 flex flex-col " +
                      (c.day ? "" : "bg-surface/30")
                    }
                  >
                    {c.day && (
                      <>
                        <span className="font-mono text-xs text-muted-foreground">{c.day}</span>
                        {c.hasEvent && <span className="mt-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <aside>
              <div className="eyebrow mb-4">Neste mês</div>
              {eventsThisMonth.length === 0 && <p className="text-sm text-muted-foreground">Sem eventos agendados.</p>}
              <ul className="space-y-6">
                {eventsThisMonth.map((e) => (
                  <li key={e.date + e.title} className="border-l-2 border-accent pl-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {new Date(e.date + "T00:00:00").getDate()} {MONTHS_PT[cursor.getMonth()]}
                      {e.time ? " · " + e.time : ""}
                    </div>
                    <div className="mt-1 font-serif text-lg">
                      {e.eventSlug ? (
                        <Link
                          to="/eventos/$slug"
                          params={{ slug: e.eventSlug }}
                          className="hover:text-accent transition-colors"
                        >
                          {e.title}
                        </Link>
                      ) : (
                        e.title
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{e.location}</div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        ) : listed.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem eventos agendados de momento.</p>
        ) : (
          <StaggerChildren as="ul" step={70} dir="up">
            {listed.map((e) => {
              const d = new Date(e.date + "T00:00:00");
              const past = e.date < clock.today;
              return (
                <li
                  key={e.date + e.title}
                  className={
                    "border-t border-hairline last:border-b py-5 md:py-6 grid grid-cols-[72px_minmax(0,1fr)_auto] sm:grid-cols-[100px_minmax(0,1fr)_auto] gap-4 sm:gap-6 items-baseline transition-colors hover:bg-surface/40 " +
                    (past ? "opacity-55" : "")
                  }
                >
                  <div className="font-mono text-xs text-muted-foreground">
                    <div className="text-foreground font-serif text-xl sm:text-2xl not-italic">{d.getDate()}</div>
                    <div className="uppercase tracking-wider">
                      {MONTHS_PT[d.getMonth()].slice(0, 3)} {d.getFullYear()}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif text-lg sm:text-xl truncate">
                      {e.eventSlug ? (
                        <Link
                          to="/eventos/$slug"
                          params={{ slug: e.eventSlug }}
                          className="hover:text-accent transition-colors"
                        >
                          {e.title}
                        </Link>
                      ) : (
                        e.title
                      )}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground truncate">
                      {e.location}
                      {past && <span className="ml-2 uppercase tracking-wider text-[0.65rem]">· realizado</span>}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground whitespace-nowrap">{e.time ?? "—"}</div>
                </li>
              );
            })}
          </StaggerChildren>
        )}
      </section>
    </>
  );
}
