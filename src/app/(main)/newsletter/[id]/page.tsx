import { createClient } from "@/lib/supabase/server";
import { Article } from "@/types/db";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import Head from "next/head";
import Markdown from 'react-markdown'
import { Metadata } from "next";
import Share from "./components/share";


export const generateMetadata = async ({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> => {
    const { id } = await params;
    const supabase = await createClient(await cookies());
    const { data, error }: { data: Article | null, error: any } = await supabase
        .from('news')
        .select('title, summary')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching article metadata:', error);
        return {
            title: 'Newsletter',
            description: 'Newsletter page',
        };
    }
    return {
        title: data.title || 'Newsletter',
        description: data.summary || 'Newsletter page',
    };
};


export default async function Page({
    params
}: {
    params: Promise<{id: string}>
}) {

    const { id } = await params;
    const supabase = await createClient(await cookies());
    const { data, error }: {data: Article | null, error: any} = await supabase.from("news").select("*").eq("id", id).single();
    if (error) {
        console.log(error);
        error.code == "PGRST116" || error.code == '22P02' ? notFound() : null;
        console.error("Error fetching newsletter:", error);
        return <div className="pt-[10%]">Error loading newsletter</div>;
    }

    return (
        <>
        <Head>
            <link rel="preload" as="image" href={data?.cover || "/images/logo/hd-transparent-dsi-logo.png"}></link>
        </Head>
        <div className="flex relative h-[70vh] w-full shadow-lg">
            <Image
                src={data?.cover || "/images/logo/hd-transparent-dsi-logo.png"}
                alt={data?.title || "Newsletter Image"}
                width={800}
                height={400}
                className="object-cover w-full shadow-md"
            
            />
            <div className="absolute bottom-0 w-full flex flex-col items-center dark:bg-black/70 bg-white/70 py-4 px-5">
                <h1 className="text-2xl lg:text-3xl font-bold mt-5">{data?.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{new Date(data?.created_at || "").toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })} | {data?.category || 'Uncategorized'}</p>
            </div>
        </div>
        <div className="flex flex-col items-center w-full px-32 pt-5">
            <Markdown>
                {data?.content || ""}
            </Markdown>
        </div>
        </>
    )
    

}