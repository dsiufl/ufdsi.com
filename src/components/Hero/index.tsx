"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
      <section
        id="home"
        className="relative z-10 flex min-h-screen w-full items-start justify-center overflow-hidden bg-background dark:bg-gray-900 pt-44 md:pt-52"
      >
        {/* Data Science Curves Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Curvy lines representing data science curve fitting */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background gradient */}
            <defs>
              <linearGradient id="curveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FA812F" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FAB12F" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="curveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAB12F" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#DD0303" stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id="curveGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DD0303" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#FA812F" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            
            {/* Curve 1 - Polynomial-like curve */}
            <path
              d="M0,400 Q200,200 400,350 T800,300 T1200,450"
              stroke="url(#curveGradient1)"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            
            {/* Curve 2 - Exponential-like curve */}
            <path
              d="M0,600 Q300,400 600,200 T1200,100"
              stroke="url(#curveGradient2)"
              strokeWidth="2.5"
              fill="none"
              opacity="0.8"
            />
            
            {/* Curve 3 - Sine wave-like curve */}
            <path
              d="M0,500 Q150,300 300,500 T600,300 T900,500 T1200,400"
              stroke="url(#curveGradient3)"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
            
            {/* Curve 4 - Logistic curve */}
            <path
              d="M0,700 Q400,500 600,300 Q800,200 1000,300 Q1100,350 1200,400"
              stroke="url(#curveGradient1)"
              strokeWidth="2.5"
              fill="none"
              opacity="0.8"
            />
            
            {/* Grid lines for data visualization feel */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#FAB12F" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="mx-auto max-w-[900px] text-center px-4 flex flex-col h-auto justify-center">
                <div className="mb-4 md:mb-6">
                  <h2 className="mb-1 sm:mb-2 text-lg font-medium text-foreground md:text-2xl">
                    <b>Data Science and Informatics</b>
                  </h2>
                  <h1 className="mb-0 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground whitespace-nowrap">
                    A COMMUNITY FOR
                  </h1>
                  
                  {/* Fixed height container with absolute positioning for text */}
                  <div className="relative h-[50px] sm:h-[60px] md:h-[70px] lg:h-[85px] xl:h-[100px] flex items-center justify-center">
                    <div 
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        fadeState === "in" ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="text-primary font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] xl:text-6xl whitespace-nowrap px-4">
                        {currentPhrase}
                      </div>
                    </div>
                    
                  </div>
                  <h2 className="mb-1 sm:mb-2 text-lg font-medium italic text-foreground md:text-2xl">
                    &ldquo;Knowledge should be accessible to all&rdquo;
                  </h2>
                </div>
                
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Main Learn More Button */}
                  <Button asChild size="lg" className="rounded-full px-8 py-3 text-base font-semibold shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 active:shadow-md active:scale-95">
                    <Link href="/about">
                      LEARN MORE
                    </Link>
                  </Button>
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
      </section>
    </>
  );
};

export default Hero;
