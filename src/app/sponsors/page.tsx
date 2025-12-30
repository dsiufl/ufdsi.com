'use client';
import Image from "next/image";

const SponsorsPage = () => {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="pt-10 pb-20 md:pb-24 lg:pb-28">
        <div className="container">
          <div className="w-full px-4">
            <div className="flex flex-wrap items-center justify-between">
              {/* Left Content */}
              <div className="w-full px-4 lg:w-1/2">
                <div className="max-w-[570px]">
                  <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                    Sponsors & Collaborators
                  </h1>
                  <p className="mb-12 text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg sm:leading-relaxed">
                    Our industry partnerships work to connect our members and the greater UF community with companies at the forefront of data science and AI/ML.
                  </p>
                  <div className="mb-8">
                    <p className="mb-4 text-lg font-semibold text-black dark:text-white">
                      Interested in partnering with us?
                    </p>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Image */}
              <div className="w-full px-4 lg:w-1/2">
                <div className="mx-auto max-w-[600px] lg:mr-0">
                  <Image
                    src="/images/newsletter/shellhacks25/1.jpg"
                    alt="DSI takes on Shellhacks"
                    width={600}
                    height={400}
                    className="mx-auto max-w-full rounded-lg drop-shadow-three dark:drop-shadow-none lg:mr-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sponsor Section - Banner Style */}
      <section className="py-10 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="w-full px-4">
            <div className="mx-auto max-w-7xl">
              {/* Banner Content */}
              <div className="relative bg-slate-100 dark:bg-gray-700 rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-200 dark:border-gray-600">
                {/* Main Content */}
                <div className="relative z-10 text-center">
                  {/* Main Sponsor Badge */}
                  <div className="mb-6">
                    <span className="inline-block px-6 py-2 text-sm font-semibold text-white bg-primary rounded-full">
                      Main Sponsor
                    </span>
                  </div>
                  
                  {/* AIIRI Logo - Prominently Displayed */}
                  <div className="mb-8 flex justify-center">
                    <div className="relative">
                      <Image
                        src="/images/sponsors/aiiri-logo.webp"
                        alt="AIIRI Logo"
                        width={600}
                        height={300}
                        className="mx-auto max-w-full h-auto drop-shadow-lg brightness-0 dark:brightness-0 dark:invert"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* Subtitle */}
                  <p className="mb-8 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
                    Driving innovation in AI and data science research
                  </p>
                  
                  {/* CTA Button */}
                  <a
                    href="https://ai.research.ufl.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Visit AIIRI
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="w-full px-4">
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-12">
                <h3 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Our Collaborators
                </h3>
                <div className="mx-auto mb-4 h-1 w-16 bg-primary rounded-full"></div>
                <p className="text-base text-body-color dark:text-body-color-dark leading-relaxed max-w-2xl mx-auto">
                  We are grateful for the ongoing support and collaboration from various departments and organizations.
                </p>
              </div>

              {/* Tier 1: Featured Collaborator (UFIT) - Aligned with Main Sponsor Style */}
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 group hover:border-primary/50">
                  {/* Top Accent Bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary"></div>
                  
                  <div className="p-8 md:p-10 text-center">
                    {/* Logo Container */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative h-24 w-full max-w-[300px] flex items-center justify-center p-2">
                        <Image
                          src="/images/sponsors/UFIT.png" 
                          alt="UF Information Technology"
                          width={300}
                          height={120}
                          className="object-contain max-h-24 w-auto dark:brightness-0 dark:invert"
                        />
                      </div>
                    </div>

                    <p className="text-base text-body-color dark:text-body-color-dark mb-6 max-w-lg mx-auto">
                      HiPerGator supercomputing infrastructure & technical workshops
                    </p>
                    <a 
                      href="https://it.ufl.edu" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 px-8 py-3 text-sm font-semibold text-black dark:text-white border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary shadow-sm group-hover:shadow-md"
                    >
                      Visit Website
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Tier 2: Partner Departments Grid - Visual & Colorful */}
              <div>
                <div className="text-sm font-medium text-center text-body-color dark:text-body-color-dark mb-6">
                  We also appreciate support from:
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { 
                      name: "Statistics Department", 
                      url: "https://stat.ufl.edu/",
                      logo: "/images/sponsors/Statistics.png"
                    },
                    { 
                      name: "UF Smathers Libraries", 
                      url: "https://uflib.ufl.edu/",
                      logo: "/images/symposium-25/sponsors/smathers.png"
                    },
                    { 
                      name: "CISE Department", 
                      url: "https://cise.ufl.edu/",
                      logo: "/images/symposium-25/sponsors/CISE.png"
                    },
                    { 
                      name: "UF AI2 Center", 
                      url: "https://ai.ufl.edu/about/the-ai-center/",
                      logo: "/images/symposium-25/sponsors/AI2.png"
                    }
                  ].map((partner, index) => (
                    <a
                      key={index}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/50"
                    >
                      <div className="relative h-20 w-full flex items-center justify-center">
                        <Image
                          src={partner.logo}
                          alt={`${partner.name} Logo`}
                          fill
                          className="object-contain p-1 dark:brightness-0 dark:invert"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Section */}
      <section className="py-16 md:py-20 lg:py-24 border-t border-gray-200 dark:border-gray-700">
        <div className="container">
          <div className="w-full px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                  Sponsorship Tiers
                </h2>
                <div className="mx-auto mb-6 h-1 w-20 bg-primary"></div>
                <p className="text-base text-body-color dark:text-body-color-dark">
                  If none of these packages work for you, please email us at{" "}
                  <a 
                    href="mailto:dsiufl@gmail.com" 
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                  >
                    dsiufl@gmail.com
                  </a>
                  . We would love to work with you to make a package that works for you!
                </p>
              </div>

              {/* Sponsorship Table */}
              <div className="overflow-x-auto -mx-4 px-4">
                <div className="min-w-[800px] rounded-xl border-2 border-primary/20 shadow-xl bg-white dark:bg-black ring-1 ring-primary/10">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-0">
                    <div className="bg-primary/10 p-3 md:p-4 text-left rounded-tl-xl border-r border-gray-300 dark:border-gray-600 min-w-[200px]">
                      <p className="text-xs md:text-sm font-semibold text-primary">
                        Logo visibility is much more prominent with higher tiers.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-300 to-gray-600 p-3 md:p-4 text-center border-r border-gray-400 min-w-[120px]">
                      <h3 className="text-base md:text-lg font-bold text-white whitespace-nowrap">SILVER</h3>
                      <p className="text-xs md:text-sm text-white">$500</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-3 md:p-4 text-center border-r border-orange-400 min-w-[120px]">
                      <h3 className="text-base md:text-lg font-bold text-white whitespace-nowrap">GOLD</h3>
                      <p className="text-xs md:text-sm text-white">$1000</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-300 to-blue-600 p-3 md:p-4 text-center rounded-tr-xl min-w-[120px]">
                      <h3 className="text-base md:text-lg font-bold text-white whitespace-nowrap">DIAMOND</h3>
                      <p className="text-xs md:text-sm text-white">$2000</p>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      "Inclusion on the DSI website www.ufdsi.com",
                      "Instagram sponsor shoutout/highlight",
                      "Event advertisement through all social media (e.g. Linkedin, Instagram & Discord)",
                      "Promo for your opportunities in our newsletter (300+ subscribers)",
                      "Guest speaker invitation Deliver a lecture promoted and organized by DSI",
                      "Promo & optional speaker at the DSI symposium",
                      "Access to DSI resume bank",
                      "Logo on all DSI T-shirts and merchandise",
                      "Ability to host sponsored workshops together with DSI (e.g NVIDIA Deep Learning workshop series)",
                      "Inclusion on all DSI event signage (GBM's, Speaker series, etc)"
                    ].map((benefit, index) => {
                      // SILVER: benefits 1-4 (indices 0-3)
                      const silverIncludes = index < 4;
                      // GOLD: benefits 1-7 (indices 0-6)
                      const goldIncludes = index < 7;
                      // DIAMOND: all benefits (indices 0-9)
                      const diamondIncludes = index < 10;
                      
                      return (
                        <div key={index} className="grid grid-cols-4 gap-0">
                          <div className="p-3 md:p-4 text-left border-r border-gray-300 dark:border-gray-600 min-w-[200px]">
                            <p className="text-xs md:text-sm text-body-color dark:text-body-color-dark break-words">
                              {benefit.split('DSI').map((part, i) => (
                                <span key={i}>
                                  {part}
                                  {i < benefit.split('DSI').length - 1 && (
                                    <span className="font-semibold text-primary">DSI</span>
                                  )}
                                </span>
                              ))}
                            </p>
                          </div>
                          <div className="p-3 md:p-4 border-r border-gray-300 dark:border-gray-600 min-w-[120px]">
                            <div className="flex items-center justify-center h-full">
                              {silverIncludes && (
                                <svg className="h-5 w-5 md:h-7 md:w-7 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="p-3 md:p-4 border-r border-gray-300 dark:border-gray-600 min-w-[120px]">
                            <div className="flex items-center justify-center h-full">
                              {goldIncludes && (
                                <svg className="h-5 w-5 md:h-7 md:w-7 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="p-3 md:p-4 min-w-[120px]">
                            <div className="flex items-center justify-center h-full">
                              {diamondIncludes && (
                                <svg className="h-5 w-5 md:h-7 md:w-7 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SponsorsPage;
