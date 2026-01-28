import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export default function Overlay({children, title, close}: {children: React.ReactNode, title: string, close: () => void}) {
    const [open, setOpen] = useState<boolean>(true);
    const exit = () => {
        setOpen(false);
        close();
    }
    if (window.innerWidth < 768) return (
        <Drawer open={open} onOpenChange={exit}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                {children}
            </DrawerContent>
        </Drawer>
    )
    return (
        <Sheet open={open} onOpenChange={exit}>
            
            <SheetContent className="!max-w-[40vw] overflow-y-scroll ">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )

}