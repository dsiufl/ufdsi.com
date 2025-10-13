"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";

const Header = () => {

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
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
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-90 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-32 xs:w-36 sm:w-40 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-3 sm:py-4 lg:py-2" : "py-4 lg:py-8"
                }`}
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
                              usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-gray-800 hover:text-primary dark:text-white dark:hover:text-gray-200"
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
              
              {/* Mobile Menu Button */}
              <div className="flex items-center justify-end lg:hidden">
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="relative flex h-8 w-8 items-center justify-center text-gray-800 dark:text-white"
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
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <div
          className={`mobile-menu fixed left-0 right-0 top-[66px] z-30 bg-white py-2 px-4 shadow-lg dark:bg-gray-900 lg:hidden ${
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
