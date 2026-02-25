'use client';

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { Menu, MoonIcon, SunIcon } from "lucide-react";
import { menuData } from "./data";

export default function NewHeader() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sticky, setSticky] = useState(false);
    const router = useRouter()
    const pathname = usePathname();
    const handleStickyNavbar = () => {
        if (window.scrollY >= 80) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      };
      useEffect(() => {
        window.addEventListener("scroll", handleStickyNavbar);
        setMounted(true);
      }, []);
    return (
        <div 
            className={`
                 ${sticky ? 'bg-white dark:bg-gray-900 ' : "text-black"}
                header flex flex-row justify-between w-full left-0 top-0 p-5 px-10 lg:px-20
                ${pathname === '/' || pathname.includes('/newsletter/') ? `fixed` : 'sticky'}
            `}
            style={{zIndex: 100}}
        
        >
            <Link
                href="/"
                className={`header-logo block w-fit h-fit "py-4 lg:py-8"`}
              >
                <Image
                  src="/images/logo/hd-transparent-dsi-logo.png"
                  alt="DSI logo"
                  width={100}
                  height={40}
                  className="w-full block"
                />
              </Link>
              <div className="flex flex-row gap-2 items-center">
              {/* Desktop Menu */}
              <NavigationMenu className="text-sm py-2 rounded-xl hidden md:flex">
                <NavigationMenuList className="">
                    {menuData.map((item) => (
                        <div key={item.id}>
                        {
                        item.href && 
                            <NavigationMenuLink asChild>
                                <Link href={item.href} className={`nav-link !mx-0 ${sticky ? 'text-black dark:text-white' : pathname === '/' || pathname.includes('/newsletter/') ? 'text-white ' : 'text-black dark:text-white'}`}>
                                    {item.title}
                                </Link>
                            </NavigationMenuLink>
                        }
                       {
                        item.children && 
                            <NavigationMenuItem key={item.id}>
                                    <NavigationMenuTrigger className={`${sticky ? 'text-black dark:text-white' : pathname === '/' || pathname.includes('/newsletter/') ? 'text-white ' : 'text-black dark:text-white'} bg-transparent hover:bg-[#000000]/30`}>{item.title}</NavigationMenuTrigger>
                                    <NavigationMenuContent className=" min-w-0 w-96">
                                        <div className="grid grid-cols-2 w-96 gap-2 p-5">
                                            {item.children?.map((child) => (
                                                <Link key={child.id} href={child.href} className="nav-link">
                                                    {child.title}
                                                    <p className="text-xs">{child.description}</p>
                                                </Link>
                                            ))}
                                            
                                        </div>
                                        
                                    </NavigationMenuContent>
                                </NavigationMenuItem> 
                        }
                        </div>
                    ))}
                    
                    
                        

                </NavigationMenuList>
              </NavigationMenu>
              {/* Mobile Menu */}
              <NavigationMenu className="px-5 py-2 rounded-xl md:hidden">
                <NavigationMenuList className="flex flex-row">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="!bg-gray-900"><Menu /></NavigationMenuTrigger>
                    </NavigationMenuItem>

                </NavigationMenuList>
              </NavigationMenu>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="!bg-slate-100/30 w-fit h-fit !p-2 rounded-full">
                  {
                    theme === 'dark' ? (
                      <SunIcon className="" style={{width: "24px !important", height: "24px"}} />
                    ) : (
                      <MoonIcon className={`${sticky ? 'text-black dark:text-white' : pathname === '/' || pathname.includes('/newsletter/') ? 'text-white dark:text-black' : 'text-black dark:text-white'}`} style={{width: "24px", height: "24px"}} />
                    )
                  }
                </button>
              </div>
        </div>
    )
}