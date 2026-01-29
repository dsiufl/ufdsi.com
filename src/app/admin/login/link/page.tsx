import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { notFound, redirect, unauthorized } from "next/navigation";

export default async function Page(props: { 
  searchParams: Promise<{ token: string }> 
}) {
    console.log('link page accessed');
    const { token } = await props.searchParams;

    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'unknown';
    console.log("User-Agent:", userAgent);

    if (!token) {
        redirect('/admin/login');
    }
    
    
    redirect(`https://nljfmwgzmavnjzmiqgbp.supabase.co/auth/v1/verify?token=${token}&type=magiclink&redirect_to=https://unstable.jcamille.dev/admin/login`);
}