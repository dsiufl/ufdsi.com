"use client";

import { useEffect, useState } from "react";

const MINUTE = 60 * 1000;

// The page is cached for a few minutes, so the server renders the countdown as
// of its render time and the browser corrects it on load.
export default function Countdown({ target, renderedAt }: { target: number; renderedAt: number }) {
  const [now, setNow] = useState(renderedAt);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  const left = Math.max(0, target - now);
  if (left === 0) return <p className="site-lede">Happening today.</p>;

  const cells = [
    { label: "Days", value: Math.floor(left / (24 * 60 * MINUTE)) },
    { label: "Hours", value: Math.floor(left / (60 * MINUTE)) % 24 },
    { label: "Minutes", value: Math.floor(left / MINUTE) % 60 },
  ];

  return (
    <dl className="site-countdown" aria-label="Time until the symposium">
      {cells.map((cell) => (
        <div key={cell.label}>
          <dt>{cell.label}</dt>
          <dd>{String(cell.value).padStart(2, "0")}</dd>
        </div>
      ))}
    </dl>
  );
}
