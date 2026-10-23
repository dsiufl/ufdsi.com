import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
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
            <DrawerContent className="bg-background">
                <DrawerHeader className="border-b">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <div className="scrollbar mb-4 max-h-[80vh] overflow-y-auto px-4 pt-4">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
    return (
        <Sheet open={open} modal={true} onOpenChange={exit}>
            <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
                <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle className="text-base">{title}</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    )
}
