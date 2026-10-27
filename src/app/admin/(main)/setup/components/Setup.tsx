'use client';

import Overlay from "@/components/Overlay/Overlay";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@/lib/supabase/client";
import { Profile } from "@/types/db";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import EditUser from "../../components/EditUser";
import { AlertContext } from "@/app/AlertProvider";


function SetupOverlay({data, exit}: {data: Profile, exit: () => void}) {
    const router = useRouter();

    const supabase = useSupabaseClient();
    const alertCtx = useContext(AlertContext)
    const submit = async (sub: Profile) => {
        if (sub.pictureURL !== data.pictureURL) {
            // Upload new picture to storage
            const blob = await fetch(sub.pictureURL).then(r => r.blob());
            const { error } = await supabase.storage.from('images')
            .upload(`team/${data.id}.jpg`, blob, {
                upsert: true,
                contentType: blob.type
            });
            if (error) {
                alertCtx.setAlert("error", "Error uploading image: " + error.message);
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
                data: {...sub}
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
export default function Setup({data}: {data: Profile}) {
    const [overlay, setOverlay] = useState<boolean>(false);
    return (
        <>
            {overlay && <SetupOverlay exit={() => setOverlay(false)} data={data} />}
            <Button onClick={() => setOverlay(true)}>Start setup</Button>

        </>
    )
}