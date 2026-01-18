'use client';
import { Button } from "@/components/ui/button";
import { AdminInfo } from "@/types/db";

export default function Actions({data}: {data?: AdminInfo}) {
    const actions = {
        "Technology Coordinator": [
            {
                title: 'DSI Symposium',
                description: 'Edit the speaker list and schedule of the upcoming symposium, edit a previous one, or create a new symposium.',
                action: 'Continue',
                onClick: () => {
                    
                }
            }
        ]
    }
    return (
        <div className="w-full h-full grid lg:grid-cols-3 py-2">
            {actions["Technology Coordinator"].map((action, index) => (
                <div key={index} className="h-fit lg:h-[13rem] rounded-xl p-4 w-[15rem] lg:w-full bg-[#000000]/30">
                    <h3>{action.title}</h3>
                    {window.innerWidth > 648 && <p>{action.description}</p>}
                    <Button onClick={action.onClick}>{action.action}</Button>
                </div>
            ))}
        </div>
    )
}