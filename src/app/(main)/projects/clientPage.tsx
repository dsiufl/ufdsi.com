"use client";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/db";
import { AccordionContent } from "@radix-ui/react-accordion";
import { CircleQuestionMark, Grape } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
export default function ClientPage({projects, faq}: {projects: Project[], faq: any[]}) {
    
    useGSAP(() => {
        gsap.registerPlugin(useGSAP);
        gsap.from(".projectgrid > div", { opacity: 0, x: 100, duration: 1, ease: "fadein", stagger: 0.3, scrollTrigger: {
            trigger: ".projectgrid",
            start: "top 80%"
        }
        })
        gsap.from(".faq", {opacity: 0, y: 20, duration: 0.5, ease: "power2.in", delay: 0.5})
        gsap.registerPlugin(ScrollTrigger);

    })
   
    return (
        <>
        <div className="flex-grow relative h-[85vh] w-screen flex flex-col items-center justify-center text-center md:text-start md:items-start md:justify-end p-10 bg-cover bg-center bg-[url('https://nljfmwgzmavnjzmiqgbp.supabase.co/storage/v1/object/public/images/IMG_2246.jpg')]">
            <div className="fade-in md:text-left text-white bg-black/50 p-5 rounded-xl md:bg-transparent">
                <h1>DSI Projects</h1>
                <p>Learn more about the student-driven data science projects hosted at DSI.</p>
            </div>
            
        </div>
        <div className="pt-10 flex flex-col items-center w-full">
            <h2>Current Projects</h2>
            <div className="projectgrid w-full flex flex-col md:grid md:grid-cols-3 items-center gap-5 py-10 px-10" >
                {projects && projects.map((project: Project) => (
                    <div key={project.id} className="relative h-fit md:h-72 p-5 hover:shadow-xl rounded-xl border shadow-md flex flex-col md:flex-row gap-2">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl">{project.title}</h3>
                            <p className="line-clamp-3">{project.description}</p>
                            <div className="md:absolute bottom-6 left-5">
                                <Link href={project.link} className="button">Learn More</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-0.5 w-[70%] bg-gray-700/30 dark:bg-white/30 mb-5"></div>
            <div className="w-full flex h-fit flex-row items-center text-center justify-center gap-4 mb-2">
                <CircleQuestionMark />
                <h2 className="faq mb-0">Frequently Asked Questions</h2>
            </div>
            <Accordion type="multiple"  className="faq w-full md:w-[70%]">
                {faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl mb-2">
                        <AccordionTrigger className="flex flex-row items-center justify-between p-4 text-black dark:text-white">
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-300">
                            {item.description}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            
                
        </div>
        
        
        </>
    )
    
    
}