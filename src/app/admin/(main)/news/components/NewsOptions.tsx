'use client'

import { SupabaseContext } from "@/app/SupabaseProvider"
import Overlay from "@/components/Overlay/Overlay"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/lib/main"
import { Article } from "@/types/db"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { EllipsisIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"

export default function NewsOptions({article}: {article: Article}) {
    const [ deleteOverlay, setDeleteOverlay ] = useState<boolean>(false);
    const router = useRouter();
    const supabaseCtx = useContext(SupabaseContext);
    const handleDelete = async () => {
        if (!supabaseCtx) return;

        const { data, error } = await supabaseCtx.from('news').delete().eq('id', article.id);
        
        if (error) {
            console.error("Error deleting article:", error);
        }
        setDeleteOverlay(false);
        router.refresh();
    }
    const DeleteOverlay = () => {
        const [ loading, setLoading ] = useState<boolean>(false);
        return (
            <Overlay title={`Delete ${article.title}?`} close={handleDelete}>
                <p>Are you sure you want to delete this article? This action cannot be undone.</p>
                <div className="flex gap-4 justify-end">
                    <button onClick={() => setDeleteOverlay(false)} className="px-4 py-2 rounded-md border hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={() => {
                        setLoading(true);
                        handleDelete();

                    }} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition" disabled={loading}>{loading ? <Spinner /> : "Delete"}</button>
                </div>
            </Overlay>
        )
    }
    return (
        <>
        {deleteOverlay && <DeleteOverlay />}
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <EllipsisIcon className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/admin/news/article/" + article.id)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOverlay(true)}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}