"use client";

import { SupabaseContext } from "@/app/SupabaseProvider";
import { AlertContext } from "@/app/AlertProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Article } from "@/types/db";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export default function NewsOptions({ article }: { article: Article }) {
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();
  const supabase = useContext(SupabaseContext);
  const alert = useContext(AlertContext);

  const remove = async () => {
    if (!supabase) return;
    const { error } = await supabase.from("news").delete().eq("id", article.id);
    if (error) {
      alert?.setAlert("error", `Couldn't delete the article: ${error.message}`);
      return;
    }
    setConfirm(false);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="admin-row-actions h-8 w-8 text-muted-foreground" aria-label={`Options for ${article.title}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/admin/news/article/${article.id}`)}>
            <Pencil className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirm(true)}>
            <Trash2 className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog open={confirm} title={`Delete "${article.title}"?`} onConfirm={remove} onClose={() => setConfirm(false)}>
        The article is removed from the site for good. This can&apos;t be undone.
      </ConfirmDialog>
    </>
  );
}
