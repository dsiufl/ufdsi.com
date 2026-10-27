'use client';

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MoonIcon, SunIcon, X } from "lucide-react";
import { DISCORD_URL, navLinks } from "../site/links";

export default function NewHeader() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      setOpen(false);
    }, [pathname]);

    const isCurrent = (href: string) => {
      const section = href.split('/')[1];
      return pathname === href || pathname.startsWith(`/${section}/`);
    };

    return (
        <header className="site-header header">
            <div className="site-wrap site-header__bar">
                <Link href="/" className="site-header__logo">
                    <Image
                      src="/images/logo/hd-transparent-dsi-logo.png"
                      alt="UF DSI home"
                      width={100}
                      height={56}
                      priority
                    />
                </Link>

                <nav className="site-nav" aria-label="Main">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                            {link.title}
                        </Link>
                    ))}
                </nav>

                <div className="site-header__actions">
                    <button
                      type="button"
                      className="site-iconbtn"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      aria-label="Toggle dark mode"
                    >
                      {mounted && theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                    </button>
                    <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="site-btn site-btn--primary site-btn--small site-header__join">
                        Join
                    </a>
                    <button
                      type="button"
                      className="site-iconbtn site-menu-toggle"
                      onClick={() => setOpen(!open)}
                      aria-expanded={open}
                      aria-controls="site-mobile-nav"
                      aria-label={open ? 'Close menu' : 'Open menu'}
                    >
                      {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {open && (
                <nav id="site-mobile-nav" className="site-wrap site-mobile-nav" aria-label="Mobile">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                            {link.title}
                        </Link>
                    ))}
                    <Link href="/sponsors">Sponsors</Link>
                    <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Join the Discord</a>
                </nav>
            )}
        </header>
    )
}
