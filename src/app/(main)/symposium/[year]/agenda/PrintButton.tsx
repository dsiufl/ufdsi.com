"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="site-btn site-btn--ghost site-btn--small">
      Print the agenda
    </button>
  );
}
