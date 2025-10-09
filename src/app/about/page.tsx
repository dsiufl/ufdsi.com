'use client';
import dynamic from "next/dynamic";

// Use dynamic import with no SSR for the carousel component to avoid hydration issues
const NewsCarousel = dynamic(() => import("@/components/NewsCarousel"), { ssr: false });

const AboutPage = () => {
  // Article IDs for "org of year", "Ccc award", and "nvidia workshop"
  const featuredArticleIds = [1, 10, 7];

  return (
    <>
        <div className="container">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-16 md:pb-20 lg:pb-28">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-1/2 mb-12 max-w-[540px] lg:mb-0">
                <h2 className="mb-5">
                  About Data Science & Informatics
                </h2>
                <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  The UF Data Science and Informatics (DSI) is a Student Organization at the University of Florida founded in 2015. We are dedicated to promoting data science education, research, and collaboration to students of all majors and grade levels.
                </p>
                <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  We offer workshops, networking events, research opportunities, and a supportive community for anyone interested in data science, machine learning, artificial intelligence, and related fields. Most importantly, we believe knowledge should be accessible to all.
                </p>
                <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  We are officially sponsored by the University of Florida’s <a href="https://ai.research.ufl.edu/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Artificial Intelligence and Research Informatics Institute (AIIRI)</a>, which provides resources and strategic support for our initiatives. We also collaborate closely with <a href="https://it.ufl.edu/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">UF Information Technology (UFIT)</a>, which supports our members with access to the HiPerGator supercomputing infrastructure and technical workshops. Lastly, we extend our gratitude to the <a href="https://stat.ufl.edu/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Statistics Department</a>, <a href="https://uflib.ufl.edu/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">UF Smathers Libraries</a>, the <a href="https://www.cise.ufl.edu/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Department of Computer & Information Science & Engineering (CISE)</a>, and the <a href="https://ai.ufl.edu/about/the-ai-center/" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">UF AI2 Center</a> for their valuable support in the past.
                </p>
              </div>

              <div className="w-full px-4 lg:w-1/2 text-center relative z-10 inline-block max-w-[500px]">
                    <NewsCarousel articleIds={featuredArticleIds} />
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default AboutPage; 