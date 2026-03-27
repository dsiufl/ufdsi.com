import { Spinner } from "../ui/spinner";

export default function Loading({ message }: {message: string}) {
    return (
        <div className="flex flex-col">
            <Spinner className="size-24" />
            <p>{message}</p>
        </div>
    )
}