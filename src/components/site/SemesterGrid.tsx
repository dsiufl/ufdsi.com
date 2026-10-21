"use client";

import Link from "next/link";
import { useState } from "react";
import type { Semester } from "@/lib/semester";

const pad = (n: number) => String(n).padStart(2, "0");

export default function SemesterGrid({ semester }: { semester: Semester }) {
  const withWorkshops = semester.weeks.filter((week) => week.workshops.length > 0);
  const initial = semester.isCurrent
    ? (withWorkshops.find((week) => week.status !== "past") ?? withWorkshops[withWorkshops.length - 1])
    : withWorkshops[0];
  const [selected, setSelected] = useState<number | null>(initial?.number ?? null);
  const week = semester.weeks.find((w) => w.number === selected);

  return (
    <div className="site-sem">
      <ol className="site-sem__grid" aria-label={`${semester.name}, weeks 1 to ${semester.weeks.length}`}>
        {semester.weeks.map((w) => {
          const label = (
            <>
              <span className="site-week__num">{pad(w.number)}</span>
              <span className="site-week__date">{w.range}</span>
            </>
          );
          return (
            <li key={w.number}>
              {w.workshops.length > 0 ? (
                <button
                  type="button"
                  className={`site-week site-week--${w.status}`}
                  aria-pressed={selected === w.number}
                  onClick={() => setSelected(w.number)}
                >
                  {/* Visible text leads the accessible name, so voice control can say "01". */}
                  {label}
                  <span className="sr-only">
                    , {w.workshops.length} workshop{w.workshops.length > 1 ? "s" : ""}
                  </span>
                  {w.workshops.length > 1 && (
                    <span className="site-week__count" aria-hidden="true">×{w.workshops.length}</span>
                  )}
                </button>
              ) : (
                <div className={`site-week site-week--${w.status}`}>{label}</div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="site-sem__panel">
        <p className="site-sem__tally">
          {semester.total} / {semester.weeks.length}
          <small>
            {semester.total === 1 ? "workshop" : "workshops"} across {semester.weeks.length} weeks
            {semester.isCurrent && semester.currentWeek ? `. This is week ${semester.currentWeek}.` : "."}
          </small>
        </p>

        {week ? (
          <div aria-live="polite">
            <p className="site-label">
              Week {pad(week.number)} · {week.range}
            </p>
            <ul className="site-sem__items">
              {week.workshops.map((workshop) => (
                <li key={workshop.id}>
                  <h3 className="site-h3">{workshop.title}</h3>
                  <p>
                    {workshop.when}
                    {workshop.location ? ` · ${workshop.location}` : ""}
                    <br />
                    {workshop.speaker}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="site-body">
            Nothing is on the calendar for {semester.name} yet. New workshops appear here as soon as
            they are announced.
          </p>
        )}

        <Link href="/workshops-list" className="site-link" style={{ fontWeight: 600 }}>
          All workshops <span className="site-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
