import Overlay from "@/components/Overlay/Overlay"
import { Speaker } from "@/types/db"
import EditSpeaker from "./EditSpeaker"

export default function EditSpeakerOverlay({close, save, speaker, symposium}: {close: () => void, save: (speaker: Speaker) => void, speaker: Speaker, symposium: number}) {
    return (
        <Overlay title="Edit Speaker" close={close}>
            <EditSpeaker speaker={speaker} save={async (data: Speaker) => {
                data.symposium = symposium
                save(data);
                close();
            }} />
        </Overlay>
    )
}