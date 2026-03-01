'use client';

import Overlay from "@/components/Overlay/Overlay";
import { Button } from "@/components/ui/button";

import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/main";
import { createUserClient } from "@/lib/supabase/client";
import { Profile } from "@/types/db";
import { Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import EditUser from "../../components/EditUser";


function SetupOverlay({data, token, exit}: {data: Profile, token: string, exit: () => void}) {    const router = useRouter();
    
    const supabase = createUserClient();
    const submit = async (sub: Profile) => {
        if (sub.pictureURL !== data.pictureURL) {
            // Upload new picture to storage
            const blob = await fetch(sub.pictureURL).then(r => r.blob());
            console.log(blob);
            const { data: result, error } = await supabase.storage.from('images')
            .upload(`team/${data.id}.jpg`, blob, {
                upsert: true,
                contentType: blob.type
            });
            if (error) {
                console.error("Error uploading image:", error);
                return;
            } else {
                const { data: urlData } = supabase.storage.from('images')
                .getPublicUrl(`team/${data.id}.jpg`);
                sub.pictureURL = urlData.publicUrl;
            }
        }
        return fetch('/api/auth/firsttimesetup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {...sub},
                token: token
            })
        }).then((res) => {
            if (res.ok) {
                router.push('/admin/dashboard');
            }
        }).catch((err) => {
            console.error("Error during setup:", err);
        });

    }

    return (
        <Overlay 
            close={() => {
                exit();
            }}
            title="First time Setup"
        >
            <div className="flex flex-col items-center justify-center w-full">
                <EditUser data={data} onSubmit={submit}/>
            </div>
        </Overlay>
    )
}
export default function Setup({data, token}: {data: Profile, token: string}) {
    const [overlay, setOverlay] = useState<boolean>(false);
    return (
        <>
            {overlay && <SetupOverlay exit={() => setOverlay(false)} data={data} token={token} />}
            <Button onClick={() => setOverlay(true)}>Start setup</Button>
        
        </>
    )
}