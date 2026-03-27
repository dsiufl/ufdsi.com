import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export default function Overlay({children, title, close}: {children: React.ReactNode, title: string, close: () => void}) {
    const [open, setOpen] = useState<boolean>(true);
    const exit = () => {
        setOpen(false);
        close();
        setTimeout(() => {
            document.body.style.pointerEvents = "";
        }, 300);
    }
    if (window.innerWidth < 768) return (
        <Drawer direction="right" open={open} onOpenChange={exit}>
            <DrawerContent className="">
                <DrawerHeader className=" bg-white dark:bg-black">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <div className="scrollbar overflow-y-auto px-4 mb-4 max-h-[80vh]">
                    {children}
                </div>
                
            </DrawerContent>
        </Drawer>
    )
    return (
        <Sheet open={open} modal={true} onOpenChange={exit}>
            <SheetContent className="!max-w-[40vw] overflow-y-scroll ">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )

}