import Editor from "./components/Editor";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function page() {
    const cookieStore = await cookies();
      const supabase = await createClient(cookieStore);
      const workshops = await supabase.from("workshops").select("*");
      console.log("workshops", workshops);
      if (workshops.error) {
        notFound();
      }
    return (
        <div className="w-full h-screen flex flex-col text-center items-center justify-center">
            <h2>DSI Workshops</h2>
            <div className="w-full h-full py-4 px-10 bg-[#000000]/30 flex flex-col items-start">
                <Editor workshops={workshops.data} />
                <div className="w-full flex flex-col items-center">
                    <h3 className="mt-10 mb-4 font-bold">Upcoming Workshops</h3>
                
                    <div className="flex flex-wrap gap-6">
                    {workshops.data?.filter(workshop => new Date(workshop.datetime) > new Date()).map((workshop) => (
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
    )
}