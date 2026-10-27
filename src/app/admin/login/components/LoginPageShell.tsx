import type { ReactNode } from "react";

/**
 * Centered single-column shell for the sign-in / accept-invite pages.
 * Clerk's prebuilt widget is a self-contained branded card (logo, heading,
 * "Secured by Clerk" footer) -- a separate hero panel next to it reads as
 * two competing designs, so branding here lives in the background treatment
 * only, not a second block of copy.
 */
export function LoginPageShell({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white px-6 py-10">
      {/* Soft mesh gradient background (Caleo-style) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-[#eef2ff] to-slate-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[12%] -top-[14%] h-[min(70vw,32rem)] w-[min(70vw,32rem)] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,33,165,0.14),transparent_68%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[10%] top-[8%] h-[min(60vw,28rem)] w-[min(60vw,28rem)] rounded-full bg-[radial-gradient(circle_at_70%_40%,rgba(99,102,241,0.16),transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] left-[18%] h-[min(55vw,24rem)] w-[min(55vw,24rem)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.12),transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div className="relative z-10 flex w-full flex-1 items-center justify-center">
        {children}
      </div>

      <footer className="relative z-10 w-full border-t border-border/70 pt-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {year} University of Florida · Data Science and Informatics
          </span>
          <a
            href="https://privacy.ufl.edu/internet-privacy/"
            className="font-medium text-[#0021A5] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
