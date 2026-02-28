"use client";

import { ThemeProvider } from "next-themes";
import { SupabaseProvider } from "./SupabaseProvider";
import AlertProvider from "./AlertProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <SupabaseProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
