import { SupabaseContext } from "@/app/SupabaseProvider";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/types/db";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useContext } from "react";
import Editor from "./components/Editor";


export default async function Page({
    params
}: {
    params: Promise<{id: string}>
}) {
    const supabaseCtx = await createClient(await cookies());
    const { id } = await params;
    let article = {} as Article;
    
    if (id !== "new") {
        const {data, error} = await supabaseCtx.from("news").select().eq("id", id).single();
        if (error) {
            console.error("Error fetching article:", error);
            if (error.code == "PGRST116") {
                notFound();
            } else return <div className="pt-[10%]">Error loading article</div>;
        }
        article = data;
    }
    return (
        <div className="pt-[10%] flex flex-col items-center">
            
            <Editor article={article} />
        </div>
    )
        

}