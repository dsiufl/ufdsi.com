import "@/styles/admin.css";

import type { ReactNode } from "react";
import { LoginHero } from "./LoginHero";

export function LoginPageShell({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="admin-root flex min-h-screen flex-col bg-background">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:px-14 xl:px-20">
          {children}
        </div>
        <div className="hidden min-h-0 flex-1 flex-col lg:flex lg:max-w-[52%] xl:max-w-[50%]">
          <LoginHero />
        </div>
      </div>
      <footer className="border-t px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {year} UF Data Science and Informatics</span>
          <a
            href="https://privacy.ufl.edu/internet-privacy/"
            className="font-medium text-[var(--a-blue)] hover:underline"
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
