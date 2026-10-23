import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Logo, step label, title and blurb shared by every sign-in screen. */
export function AuthCard({
  step,
  title,
  description,
  children,
  footer,
}: {
  step?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <Link href="/" className="mb-10 inline-block" aria-label="ufdsi.com">
        <Image src="/images/logo/hd-transparent-dsi-logo.png" alt="UF Data Science Initiative" width={140} height={56} className="h-auto w-[110px] object-contain" priority />
      </Link>
      {step && <p className="admin-label mb-3">{step}</p>}
      <h1 className="admin-title">{title}</h1>
      {description && <p className="mb-0 mt-2 text-base text-muted-foreground">{description}</p>}
      {children && <div className="mt-8">{children}</div>}
      {footer && <div className="mt-8 border-t pt-5 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}

/** Inline status line in the admin style: square marker, plain text. */
export function Notice({ tone = "info", children }: { tone?: "info" | "ok" | "error"; children: ReactNode }) {
  const color = tone === "error" ? "var(--a-signal)" : tone === "ok" ? "var(--a-ok)" : "var(--a-blue)";
  return (
    <div role={tone === "error" ? "alert" : "status"} className="flex gap-3 border-l-2 bg-card px-4 py-3 text-sm leading-relaxed" style={{ borderColor: color }}>
      <span className="mt-[7px] size-[7px] shrink-0" style={{ background: color }} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export const authLink = "font-medium text-[var(--a-blue)] underline-offset-4 hover:underline";
