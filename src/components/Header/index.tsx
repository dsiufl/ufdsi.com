"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RefObject, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import menuData from "./menuData";

const Header = ({ref}: {ref?: RefObject<HTMLDivElement>}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sticky, setSticky] = useState(false);
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
    setSticky(true);
  };

  // Sticky Navbar
  
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

  // Submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header ${usePathName == '/' ? `fixed ${sticky ? 'bg-white dark:bg-gray-900 ' : "text-white"}` : 'sticky'} 
                    flex flex-col left-0 top-0 z-40 w-full items-center p-4 mb-10
                    ${sticky && usePathName !== '/' ? "bg-white dark:bg-black" : ""}`}
        ref={ref}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-32 xs:w-36 sm:w-40 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full "py-4 lg:py-8"`}
              >
                <Image
                  src="/images/logo/hd-transparent-dsi-logo.png"
                  alt="DSI logo"
                  width={100}
                  height={40}
                  className="w-full block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-end px-4">
              <div className="hidden lg:block">
                <nav id="navbarCollapse">
                  <ul className="flex items-center space-x-6">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`flex text-base font-medium ${
                              menuItem.title === "HOME"
                                ? "rounded-full border-2 border-gray-800 px-6 py-0.5 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
                                : usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "hover:text-primary dark:text-white dark:hover:text-primary"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between text-base text-gray-800 hover:text-primary dark:text-white dark:hover:text-gray-200"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu?.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              {/* Mobile Menu Controls */}
              <div className="flex items-center justify-end lg:hidden">
                {/* Theme Toggle Button */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 dark:bg-black text-gray-800 backdrop-blur-md transition-all hover:bg-white/20 dark:text-white mr-3"
                  aria-label="Toggle Theme"
                >
                  {mounted && (
                    theme === 'dark' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                      </svg>
                    )
                  )}
                </button>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="relative flex h-8 w-8 items-center justify-center dark:text-white"
                >
                  <div className="flex flex-col justify-center items-center w-full h-full">
                    <span
                      className={`absolute block h-[2px] w-5 bg-current transition-all duration-300 ${
                        navbarOpen ? "rotate-45" : "-translate-y-1.5"
                      }`}
                    />
                    <span
                      className={`absolute block h-[2px] w-5 bg-current transition-all duration-300 ${
                        navbarOpen ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    <span
                      className={`absolute block h-[2px] w-5 bg-current transition-all duration-300 ${
                        navbarOpen ? "-rotate-45" : "translate-y-1.5"
                      }`}
                    />
                  </div>
                </button>
              </div>
              
              {/* Desktop Theme Toggle */}
              <div className="hidden lg:flex items-center justify-end ml-4">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-800 shadow-md backdrop-blur-md transition-all hover:bg-white/20 dark:text-white"
                  aria-label="Toggle Theme"
                >
                  {mounted && (
                    theme === 'dark' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                      </svg>
                    )
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <div
          className={`mobile-menu absolute top-[100%] left-0 right-0 z-30 bg-white dark:bg-gray-900 py-2 px-4 shadow-lg  lg:hidden ${
            navbarOpen ? "block" : "hidden"
          }`}
          style={{ maxHeight: "calc(100vh - 66px)", overflowY: "auto" }}
        >
          <ul className="block space-y-2">
            {menuData.map((menuItem, index) => (
              <li key={index} className="group relative border-b border-gray-100 dark:border-gray-800 py-2">
                {menuItem.path ? (
                  <Link
                    href={menuItem.path}
                    className={`flex text-base font-medium ${
                      usePathName === menuItem.path
                        ? "text-primary dark:text-primary"
                        : "text-gray-800 dark:text-white"
                    }`}
                    onClick={() => setNavbarOpen(false)}
                  >
                    {menuItem.title}
                  </Link>
                ) : (
                  <>
                    <div
                      onClick={() => handleSubmenu(index)}
                      className="flex cursor-pointer items-center justify-between text-base text-gray-800 dark:text-white"
                    >
                      {menuItem.title}
                      <span className="pl-3">
                        <svg width="20" height="20" viewBox="0 0 25 24">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </div>
                    <div
                      className={`submenu pl-4 mt-2 ${
                        openIndex === index ? "block" : "hidden"
                      }`}
                    >
                      {menuItem.submenu?.map((submenuItem, idx) => (
                        <Link
                          href={submenuItem.path}
                          key={idx}
                          className="block py-2 text-sm text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                          onClick={() => setNavbarOpen(false)}
                        >
                          {submenuItem.title}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
