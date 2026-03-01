import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { Activity, AdminInfo, Speaker, Symposium } from "@/types/db";
import { UserResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Image from "next/image";
import Main from "./components/main/Main";
import { redirect } from "next/navigation";
import { use } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EllipsisIcon } from "lucide-react";

export default async function Page() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } }: UserResponse = await supabase.auth.getUser();

    const req: {data: AdminInfo} = await supabase.schema("admin").from('people').select().eq('id', user?.id).single()
    const data = req.data;

    const { data: activities }: {data: Activity[]} = await supabase.schema('admin').from('activity_log').select("*, people (first_name, last_name)").order('created_at', { ascending: false }).limit(10);
    const { data: workshops } = await supabase.from("workshops").select("*").order('datetime', { ascending: true }).limit(5);
    const detailedActivities = activities.map(activity => {
        let description = "";
        if (activity.people) {
            description += `${activity.people.first_name} ${activity.people.last_name} `;
        } else {
            description += "A user ";
        }
        
        switch (activity.action_type) {
            case 'INSERT':
                description += 'created';
                break;
            case 'UPDATE':
                description += 'updated';
                break;
            case 'DELETE':
                description += 'deleted';
                break;
            default:
                description += activity.action_type;
        }
        switch (activity.table_name) {
            case 'speakers':
                const speaker = (activity.new_data ?? (activity.old_data ?? {})) as Speaker;
                description += ` speaker ${speaker.name}`;
                const speakerSymposium = speaker.symposium ?? "unknown";
                description += ` for ${speakerSymposium} symposium`; ;
                break;
            case 'symposium':
                const symposium = activity.new_data ? (activity.new_data as Symposium).year : null
                description += `${symposium} symposium`;
                break;
            case 'people':
                const data = activity.new_data ?? activity.old_data;
                const person = data ? `${(data as AdminInfo).first_name} ${(data as AdminInfo).last_name}` : "a user";
                description += ` user ${person}`;
                break;
            case 'news':
                const article = activity.new_data ?? activity.old_data;
                const title = article ? (article as any).title : "an article";
                description += ` news article ${title}`;
                break;
            default:
                description += ` on ${activity.table_name}`;
        }
        activity.description = description;
        return activity;
    })
    if (!data || !data.account_setup) {
        console.log('redirecting to setup');
        redirect('/admin/setup');
    }   
    return (
        <div className="flex flex-col h-screen">
            <div className="px-10 pt-[10%]">
                <h1>Hi, {data?.first_name}!</h1>
                <p className="text-gray-500">{data?.role} | Data Science and Informatics</p>
            </div>
            <div className="md:top-0 flex flex-col md:flex-row py-4 px-6 bg-black/5 dark:bg-[#000000]/30 rounded-lg w-full h-screen">
                <div>
                    <h3>Activity across DSI</h3>
                    <Table className="w-full bg-sky-50 dark:bg-gray-800 max-h-[40rem]">
                        <TableBody className="text-left">
                            {detailedActivities.map(activity => (
                                <TableRow className="text-left" key={activity.id}>
                                    <TableCell className="w-fit">{activity.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col items-start justify-start mt-4 md:mt-0 md:ml-10">
                    <h3 className="mb-4 font-bold">Upcoming Workshops</h3>
                
                    <div className="flex flex-wrap gap-6">
                    {workshops.filter(workshop => new Date(workshop.datetime) > new Date()).length === 0 && <p className="text-sm dark:text-gray-500">No upcoming workshops.</p>}
                    {workshops.filter(workshop => new Date(workshop.datetime) > new Date()).map((workshop) => (
                        <div 
                            key={workshop.id} 
                            className={`group bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300 ${workshop.link ? 'cursor-pointer' : ''}`}
                            onClick={workshop.link ? () => window.open(workshop.link, '_blank', 'noopener,noreferrer') : undefined}
                        >
                            {/* Image Header */}
                            <div className={`relative h-32 overflow-hidden`}>
                                <Image 
                                    src={workshop.cover} 
                                    alt={workshop.title}
                                    fill
                                    className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-300"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                                {/* Workshop Title */}
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                                    {workshop.title}
                                </h3>
                                
                                {/* Presenter/Time */}
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {workshop.speaker} | {new Date(workshop.datetime).toLocaleDateString()} | {new Date(workshop.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {workshop.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div> 
        </div>
    );
}