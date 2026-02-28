
import { projectUpdate } from "next/dist/build/swc/generated-native";
import { cookies } from "next/headers"
import Image from "next/image";
import Link from "next/link";

import { createUserClient } from "@/lib/supabase/client";
import ClientPage from "./clientPage";


export default async function page() {

    const cookieStore = await cookies();
    const supabase = await createUserClient();
    
    
    const {data: projects, error} = await supabase.from("projects").select("*")



    const faq = [
        {title: "What are DSI projects?", description: "Our projects offer students an incredible opportunity to get involved with DSI and learn new skills that prepare them for research and careers in data science." },
        {title: "Who can get involved?", description: "Anyone that meets the requirements of the project lead can get involved! Generally, these requiurements are not stringent as projects are an opportunity to learn and develop skills."},
        {title: "How do I get involved?", description: "Check out the list of projects below and contact a lead if interested!"}
    ]

    return (
        <ClientPage projects={projects} faq={faq} />
    )
    
}