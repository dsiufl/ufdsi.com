import { AdminInfo } from "@/types/db";
import Image from "next/image";

export default function Settings({data, className}: {data?: AdminInfo, className?: string}) {
    return (
        <div className={` border-box relative p-4 w-full h-full flex items-center justify-center gap-4 py-2 ${className}`}>
            <div className="flex flex-col w-[50%] shadow-xl items-center justify-center dark:bg-[#000000]/30 rounded-xl">
                <div className="flex flex-col text-center items-center justify-center p-4">
                <Image
                        src={data?.pictureURL}
                        alt={`${data?.first_name} ${data?.last_name}`}
                        width={150}
                        height={150}
                        className="rounded-xl"
                    />
                    <h3>{data.first_name} {data.last_name}</h3>
                    <p>{data.email}</p>
                </div>
            </div>
        </div>
    )
}