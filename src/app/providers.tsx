"use client";

import { ThemeProvider } from "next-themes";
import { SupabaseProvider } from "./SupabaseProvider";
import AlertProvider from "./AlertProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <SupabaseProvider>
        <AlertProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AlertProvider>

      </SupabaseProvider>
    </ThemeProvider>
  );
}
