import { SupabaseContext } from "@/app/SupabaseProvider";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/types/db";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useContext } from "react";
import Editor from "./components/Editor";
import { canPublishNews } from "@/lib/news";


export default async function Page({
    params
}: {
    params: Promise<{id: string}>
}) {
    const supabaseCtx = await createClient(await cookies());
    const { id } = await params;
    const { data: { user } } = await supabaseCtx.auth.getUser();
    const { data: profile } = await supabaseCtx.schema("admin").from("people").select("role").eq("id", user?.id).single();
    const canPublish = canPublishNews(profile?.role);
    let article = {} as Article;
    
    if (id !== "new") {
        const {data, error} = await supabaseCtx.from("news").select().eq("id", id).single();
        if (error) {
            console.error("Error fetching article:", error);
            if (error.code == "PGRST116") {
                notFound();
            } else return <div className="admin-page"><p className="text-muted-foreground">Couldn&apos;t load that article.</p></div>;
        }
        article = data;
    }
    return (
        <Editor article={article} canPublish={canPublish} />
    )
        

}