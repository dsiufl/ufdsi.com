"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useCreateShortcut } from "./CommandMenu";

/** The page's main "new" button. Also bound to the C key. */
export function CreateButton({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
  const router = useRouter();
  const go = useCallback(() => (onClick ? onClick() : href && router.push(href)), [onClick, href, router]);
  useCreateShortcut(go);
  return (
    <Button onClick={go} title={`${label} (C)`}>
      <Plus /> {label}
      <kbd className="admin-kbd admin-kbd--on-primary ml-0.5 hidden !h-5 sm:inline-flex">C</kbd>
    </Button>
  );
}
