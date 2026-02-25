"use client";

import { ThemeProvider } from "next-themes";
import { SupabaseProvider } from "./SupabaseProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </ThemeProvider>
  );
}
