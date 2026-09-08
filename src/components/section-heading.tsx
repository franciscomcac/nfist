import type { ReactNode } from "react";
import { Reveal, SplitText } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  split = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  /** Set false to opt out of the per-word rise (e.g. for rich titles). */
  split?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <Reveal dir="up">
          <div className="eyebrow mb-4">{eyebrow}</div>
        </Reveal>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
        {split && typeof title === "string" ? <SplitText text={title} delay={90} step={46} /> : title}
      </h2>
      {intro && (
        <Reveal dir="up" delay={240}>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
