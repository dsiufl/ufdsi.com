import Overlay from "@/components/Overlay/Overlay";
import EditSpeaker from "./EditSpeaker";
import { Speaker } from "@/types/db";

export default function NewSpeakerOverlay({ close, save, symposium }: { close: () => void, save: (speaker: Speaker) => void, symposium: number }) {
    return (
        <Overlay close={close} title="Add New Speaker">
            <EditSpeaker save={(speaker) => {
                speaker.symposium = symposium 
                save(speaker);
                close();
            }} />
        </Overlay>
    )
}