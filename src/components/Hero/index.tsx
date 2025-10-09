"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const Hero = () => {
  // Define the phrases in the desired order
  const phrases = [
    "DATA SCIENCE",
    "ARTIFICIAL INTELLIGENCE",
    "MACHINE LEARNING",
    "ADVANCING RESEARCH", 
    "YOU"
  ];
  
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [fadeState, setFadeState] = useState("in"); // "in", "out"
  
  useEffect(() => {
    let phraseIndex = 0;
    
    const switchPhrase = () => {
      // Fade out current text
      setFadeState("out");
      
      // After fade out, change text and fade in
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setCurrentPhrase(phrases[phraseIndex]);
        setFadeState("in");
      }, 500); // Half a second for fade out
    };
    
    // Set up interval for phrase changes
    const interval = setInterval(switchPhrase, 3000);
    
    return () => clearInterval(interval);
  }, []); 

  const highlights = [
    "UF Student Organization of the Year Winner",
    "Hosted Research Symposiums for 2025 and 2024",
    "Winner of the UF Career Influencer Award"
  ];

  const [currentHighlight, setCurrentHighlight] = useState(highlights[0]);
  const [highlightFade, setHighlightFade] = useState("in");

  useEffect(() => {
    let highlightIndex = 0;
    const switchHighlight = () => {
      setHighlightFade("out");
      setTimeout(() => {
        highlightIndex = (highlightIndex + 1) % highlights.length;
        setCurrentHighlight(highlights[highlightIndex]);
        setHighlightFade("in");
      }, 500);
    };
    const interval = setInterval(switchHighlight, 3500);
    return () => clearInterval(interval);
  }, [highlights]);

  return (
    <>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero/landing-page.jpg"
            alt="UF Building"
            fill
            sizes="100vw"
            className="object-cover object-center dark:opacity-60"
            priority
            style={{ 
              objectPosition: "center 35%", 
              //transform: "scale(1.1)" 
            }}
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/70"></div>
        </div>

        <div className="container relative z-10 w-[100vw] h-[100vh] flex items-center justify-center">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="mx-auto max-w-[900px] text-center px-4 flex flex-col h-auto justify-center">
                <div className="mb-4 md:mb-6">
                  <h2 className="mb-1 sm:mb-2 text-lg font-medium text-white md:text-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
                    <b>Data Science and Informatics</b>
                  </h2>
                  <h1 className="mb-0 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white whitespace-nowrap" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.7)' }}>
                    A COMMUNITY FOR
                  </h1>
                  
                  {/* Fixed height container with absolute positioning for text */}
                  <div className="relative h-[50px] sm:h-[60px] md:h-[70px] lg:h-[85px] xl:h-[100px] flex items-center justify-center">
                    <div 
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        fadeState === "in" ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] xl:text-6xl whitespace-nowrap px-4" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.7)' }}>
                        {currentPhrase}
                      </div>
                    </div>
                    
                  </div>
                  <h2 className="mb-1 sm:mb-2 text-lg font-medium italic text-white md:text-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)' }}>
                    &ldquo;Making Knowledge Accessible to All&rdquo;
                  </h2>
                </div>
                
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Main Learn More Button */}
                  <Link
                    href="/about"
                    className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/90 hover:shadow-xl hover:scale-105 active:shadow-md active:scale-95"
                  >
                    LEARN MORE
                  </Link>
                  
                  {/* Social Media Buttons */}
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com/uf_dsi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 hover:shadow-lg"
                      aria-label="Follow us on Instagram"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        className="fill-current"
                      >
                        <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path>
                      </svg>
                    </a>
                    
                    <a
                      href="https://discord.gg/GUEAwEhRQw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 hover:shadow-lg"
                      aria-label="Join our Discord"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        className="fill-current"
                      >
                        <path d="M25.12,6.946c-2.424-1.948-6.257-2.278-6.419-2.292c-0.256-0.022-0.499,0.123-0.604,0.357 c-0.004,0.008-0.218,0.629-0.425,1.228c2.817,0.493,4.731,1.587,4.833,1.647c0.478,0.278,0.638,0.891,0.359,1.368 C22.679,9.572,22.344,9.75,22,9.75c-0.171,0-0.343-0.043-0.501-0.135C21.471,9.598,18.663,8,15.002,8 C11.34,8,8.531,9.599,8.503,9.615C8.026,9.892,7.414,9.729,7.137,9.251C6.86,8.775,7.021,8.164,7.497,7.886 c0.102-0.06,2.023-1.158,4.848-1.65c-0.218-0.606-0.438-1.217-0.442-1.225c-0.105-0.235-0.348-0.383-0.604-0.357 c-0.162,0.013-3.995,0.343-6.451,2.318C3.564,8.158,1,15.092,1,21.087c0,0.106,0.027,0.209,0.08,0.301 c1.771,3.11,6.599,3.924,7.699,3.959c0.007,0.001,0.013,0.001,0.019,0.001c0.194,0,0.377-0.093,0.492-0.25l1.19-1.612 c-2.61-0.629-3.99-1.618-4.073-1.679c-0.444-0.327-0.54-0.953-0.213-1.398c0.326-0.443,0.95-0.541,1.394-0.216 C7.625,20.217,10.172,22,15,22c4.847,0,7.387-1.79,7.412-1.808c0.444-0.322,1.07-0.225,1.395,0.221 c0.324,0.444,0.23,1.066-0.212,1.392c-0.083,0.061-1.456,1.048-4.06,1.677l1.175,1.615c0.115,0.158,0.298,0.25,0.492,0.25 c0.007,0,0.013,0,0.019-0.001c1.101-0.035,5.929-0.849,7.699-3.959c0.053-0.092,0.08-0.195,0.08-0.301 C29,15.092,26.436,8.158,25.12,6.946z M11,19c-1.105,0-2-1.119-2-2.5S9.895,14,11,14s2,1.119,2,2.5S12.105,19,11,19z M19,19 c-1.105,0-2-1.119-2-2.5s0.895-2.5,2-2.5s2,1.119,2,2.5S20.105,19,19,19z"></path>
                      </svg>
                    </a>
                    
                    <a
                      href="https://www.linkedin.com/company/dsiufl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 hover:shadow-lg"
                      aria-label="Connect with us on LinkedIn"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 17 16"
                        className="fill-current"
                      >
                        <path d="M15.2196 0H1.99991C1.37516 0 0.875366 0.497491 0.875366 1.11936V14.3029C0.875366 14.8999 1.37516 15.4222 1.99991 15.4222H15.1696C15.7943 15.4222 16.2941 14.9247 16.2941 14.3029V1.09448C16.3441 0.497491 15.8443 0 15.2196 0ZM5.44852 13.1089H3.17444V5.7709H5.44852V13.1089ZM4.29899 4.75104C3.54929 4.75104 2.97452 4.15405 2.97452 3.43269C2.97452 2.71133 3.57428 2.11434 4.29899 2.11434C5.02369 2.11434 5.62345 2.71133 5.62345 3.43269C5.62345 4.15405 5.07367 4.75104 4.29899 4.75104ZM14.07 13.1089H11.796V9.55183C11.796 8.7061 11.771 7.58674 10.5964 7.58674C9.39693 7.58674 9.222 8.53198 9.222 9.47721V13.1089H6.94792V5.7709H9.17202V6.79076H9.19701C9.52188 6.19377 10.2466 5.59678 11.3711 5.59678C13.6952 5.59678 14.12 7.08925 14.12 9.12897V13.1089H14.07Z" />
                      </svg>
                    </a>
                  </div>
                </div>
                {/* Highlights Section (pyramid layout, transparent boxes, with images, spaced below) */}
                {/* <div className="mt-24 flex flex-col items-center w-full">
                  <span className="mb-4 text-base sm:text-lg font-semibold uppercase tracking-widest text-teal-200 drop-shadow-md" style={{letterSpacing: '0.15em'}}>Highlights</span>
                  <div className="flex flex-col items-center w-full gap-4">
                    
                    <div className="flex justify-center w-full">
                      <div className="flex flex-col sm:flex-row items-center bg-white/30 dark:bg-gray-800/40 rounded-xl shadow-lg px-8 py-5 font-extrabold text-xl sm:text-2xl md:text-3xl text-white drop-shadow-lg backdrop-blur-md max-w-xl w-full text-center border border-white/20 dark:border-gray-700">
                        <div className="mb-3 sm:mb-0 sm:mr-5 flex-shrink-0">
                          <img src="/images/newsletter/org-of-year.jpg" alt="Student Org of Year" className="w-20 h-20 object-cover rounded-full border-4 border-white/60 shadow" />
                        </div>
                        <span>UF Student Organization of the Year Winner</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-row justify-center w-full gap-6 flex-wrap">
                      <div className="flex flex-col sm:flex-row items-center bg-white/30 dark:bg-gray-800/40 rounded-xl shadow-lg px-8 py-5 font-extrabold text-lg sm:text-xl md:text-2xl text-white drop-shadow-lg backdrop-blur-md max-w-md w-full text-center border border-white/20 dark:border-gray-700">
                        <div className="mb-3 sm:mb-0 sm:mr-5 flex-shrink-0">
                          <img src="/images/newsletter/symposium.jpg" alt="Symposiums" className="w-16 h-16 object-cover rounded-full border-4 border-white/60 shadow" />
                        </div>
                        <span>Hosted Research Symposiums for 2025 and 2024</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center bg-white/30 dark:bg-gray-800/40 rounded-xl shadow-lg px-8 py-5 font-extrabold text-lg sm:text-xl md:text-2xl text-white drop-shadow-lg backdrop-blur-md max-w-md w-full text-center border border-white/20 dark:border-gray-700">
                        <div className="mb-3 sm:mb-0 sm:mr-5 flex-shrink-0">
                          <img src="/images/newsletter/influencer.jpg" alt="Career Influencer" className="w-16 h-16 object-cover rounded-full border-4 border-white/60 shadow" />
                        </div>
                        <span>Winner of the UF Career Influencer Award</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default Hero;
