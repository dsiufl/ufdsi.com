import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { createContext, RefObject, useRef, useState } from "react";

export const AlertContext = createContext<{
    type: RefObject<"error" | "warning" | "info" | undefined>,
    message: RefObject<string | undefined>
    setAlert: (type?: "error" | "warning" | "info", message?: string) => void
    clearAlert: () => void
} | null>(null)

export default function AlertProvider({children}) {
    const type = useRef<'error' | 'warning' | 'info' | undefined>(undefined)
    const [_, setRerender] = useState(0)
    const message = useRef<string | undefined>(undefined)
    console.log("Alert type:", type.current, "message:", message.current);
    return <AlertContext.Provider value={
        {
            type,
            message,
            setAlert: (t, m) => {
                setRerender(r => r + 1)
                type.current = t
                message.current = m
            },
            clearAlert: () => {
                setRerender(r => r + 1)
                type.current = undefined
                message.current = undefined
            }
        }
    } >
        <>
        {
            (type.current && message.current) &&
            <Alert className="fixed top-0 right-0 m-10 w-fit max-w-48" style={{zIndex: 1000}}>
                <AlertTitle className="flex flex-row items-center justify-start gap-4 w-fit">
                    <AlertCircleIcon></AlertCircleIcon>
                    {type.current === 'error' ? "An error has occured." : type.current === 'info' ? "Information" : "Potential issue"}
                </AlertTitle>
                <AlertDescription className="flex flex-row gap-4">
                    <p className="text-xs">{message.current}</p>
                </AlertDescription>
            </Alert>
        }
        {children}
        </>
    </AlertContext.Provider>
}