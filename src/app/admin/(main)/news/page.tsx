import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/types/db";
import { cookies } from "next/headers";
import NewsOptions from "./components/NewsOptions";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
export default async function page() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    const { data: news, error }: { data: Article[]; error: any } = await supabase.from("news").select("*").order('created_at', { ascending: false });
    console.log(error)
    return (
        <div className="w-full pt-[10%] flex flex-col text-center items-center justify-center">
            <h2>DSI News</h2>
            <Link href="/admin/news/article/new" className="button flex gap-1"><PlusIcon /> New Article</Link>
            <div className="h-screen w-full pt-5 mt-5 px-10 bg-gray-200 dark:bg-[#000000]/70 flex items-start">
                <Table className="w-full bg-sky-50 dark:bg-gray-800 max-h-[40rem]">
                    <TableHeader>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-left">
                            {news.map((item) => (
                                <TableRow className="text-left" key={item.id}>
                                    <TableCell className="w-fit">{item.title}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <NewsOptions article={item} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    </Table>
            </div>
        </div>
    )

}