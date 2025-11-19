"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollUp from "@/components/Common/ScrollUp";

// Sample workshop data - You can replace this with actual data from your API/DB
const upcomingWorkshops = [
  {
    id: 1,
    title: "Intro to Tabular Data",
    date: "November 12th, 5pm",
    location: "AIIRI",
    description: "Learn how to work with tabular data for data analysis.",
    image: "/images/workshop/pyth.png",
    url: "#"
  }
];

const pastWorkshops = [
  {
    id: 1,
    title: "Intro to AI Agents",
    description: "Introduction to AI agents and their applications.",
    presenters: "Ragul",
    image: "/images/workshop/aiagents.png"
  },
  {
    id: 2,
    title: "Intro to R",
    description: "Introduction to R programming for data analysis.",
    presenters: "Anjali",
    image: "/images/workshop/R.png"
  },
  {
    id: 3,
    title: "Intro to Web Scraping",
    description: "Learn how to extract data from websites programmatically.",
    presenters: "Patrick",
    image: "/images/workshop/webscraping.png"
  },
  {
    id: 4,
    title: "Introduction to C",
    description: "Intro to the C Programming Language.",
    presenters: "Raul",
    image: "/images/workshop/c.jpeg"
  },
  {
    id: 5,
    title: "GPU Accelerated Scientific Computing",
    description: "Intro to GPU Accelerated Workflows.",
    presenters: "Raul",
    image: "/images/workshop/gpu.png"
  },
  {
    id: 6,
    title: "AI Chronicles",
    description: "Exploring the past, present, and future of AI.",
    presenters: "Matt, Jim, Matheus",
    image: "/images/workshop/ai.jpg"
  },
  {
    id: 7,
    title: "Applied Machine Learning",
    description: "Applied machine learning techniques.",
    presenters: "Hunor",
    image: "/images/workshop/ml.jpg"
  },
  {
    id: 8,
    title: "Convolutional Neural Networks",
    description: "Convolutional Neural Networks for image tasks.",
    presenters: "Jim, Matheus",
    image: "/images/workshop/cnn.jpg"
  },
  {
    id: 9,
    title: "Git and Github",
    description: "Essentials of Git for version control.",
    presenters: "Zach, Matheus",
    image: "/images/workshop/git.jpg"
  },
  {
    id: 10,
    title: "Language Models",
    description: "NLP and advanced language models.",
    presenters: "Sebastian, Matheus",
    image: "/images/workshop/cl.jpg"
  },
  {
    id: 11,
    title: "NumPy and MatPlotLib",
    description: "Numerical computing and data visualization.",
    presenters: "Jim, Matheus",
    image: "/images/workshop/numpy.png"
  },
  {
    id: 12,
    title: "Pandas",
    description: "Data analysis with Pandas.",
    presenters: "Marielle",
    image: "/images/workshop/pandas.png"
  },
  {
    id: 13,
    title: "Power BI",
    description: "Data insights using Power BI.",
    presenters: "Marc",
    image: "/images/workshop/pbi.jpeg"
  },
  {
    id: 14,
    title: "PyTorch",
    description: "Deep learning with PyTorch.",
    presenters: "Jim, Matheus",
    image: "/images/workshop/pytorch.jpg"
  },
  {
    id: 15,
    title: "SQL",
    description: "SQL database manipulation and querying.",
    presenters: "Marc",
    image: "/images/workshop/sql.jpeg"
  },
  {
    id: 16,
    title: "Tableau",
    description: "Data insights using Tableau.",
    presenters: "Kyle",
    image: "/images/workshop/tb.png"
  },
  {
    id: 17,
    title: "Sentence Transformers",
    description: "Using Sentence Transformers for Semantic Search.",
    presenters: "Tristan",
    image: "/images/workshop/tf.png"
  },
  {
    id: 18,
    title: "Intro To Neural Networks",
    description: "Algorithms needed for Neural Networks",
    presenters: "Ishan",
    image: "/images/workshop/nn.jpg"
  }
];

export default function WorkshopsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Modal for All Past Workshops */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Past Workshops
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastWorkshops.map((workshop, index) => {
                  // Special links for each workshop
                  const links = {
                    "Intro to R": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro%20to%20R/DSI_Intro_to_R_Workshop.ipynb",
                    "Intro to Web Scraping": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro%20to%20Web%20Scraping/intro_to_webscraping.ipynb",
                    "Introduction to C": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro_C/IntroToC.ipynb",
                    "GPU Accelerated Scientific Computing": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro_GPU/IntroToGPUAcceleratedScientificComputing.ipynb",
                    "AI Chronicles": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/AI_Chronicles",
                    "Applied Machine Learning": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Applied_ML",
                    "Convolutional Neural Networks": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/CNNS",
                    "Git and Github": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Git",
                    "Language Models": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/LanguageModels",
                    "NumPy and MatPlotLib": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/NumPy%20&%20MatPlotLib",
                    "Pandas": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Pandas",
                    "Power BI": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Power%20BI",
                    "PyTorch": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/PyTorch",
                    "SQL": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/SQL%202024",
                    "Tableau": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Tableau",
                    "Sentence Transformers": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Sentence_Transformers",
                    "Intro To Neural Networks": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Intro%20To%20Neural%20Networks"
                  };
                  const link = links[workshop.title];
                  
                  // Different background colors for variety
                  const bgColors = [
                    'bg-pink-400',
                    'bg-purple-400',
                    'bg-green-400',
                    'bg-blue-400',
                    'bg-orange-400',
                    'bg-indigo-400'
                  ];
                  const bgColor = bgColors[index % bgColors.length];
                  
                  return (
                    <div 
                      key={workshop.id} 
                      className={`group bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300 ${link ? 'cursor-pointer' : ''}`}
                      onClick={link ? () => window.open(link, '_blank', 'noopener,noreferrer') : undefined}
                    >
                      {/* Image Header */}
                      <div className={`relative h-32 ${bgColor} overflow-hidden`}>
                        <Image 
                          src={workshop.image} 
                          alt={workshop.title}
                          fill
                          className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-300"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        {/* Workshop Title */}
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                          {workshop.title}
                        </h3>
                        
                        {/* Presenter/Time */}
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {workshop.presenters}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <section
        id="workshops"
        className="relative z-10 overflow-hidden pb-16"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="mb-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Hands-On Learning
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Workshops & Training
              </h1>
              <div className="w-20 h-1 bg-teal-500 dark:bg-teal-400 mb-6 rounded-full"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Join our specialized workshops in data science, machine learning, and programming. 
                Learn from experts and build practical skills that matter.
              </p>
            </div>
            
            {/* Right Column - Image */}
            <div className="hidden md:block relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image 
                src="/images/workshop/1.png"
                alt="Workshop illustration"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Two Column Layout: Past Workshops (Left) and Upcoming Workshops (Right) */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Past Workshops Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Past Workshops
                </h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  View All →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pastWorkshops.slice(0, 6).map((workshop, index) => {
                  // Special links for each workshop
                  const links = {
                    "Intro to R": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro%20to%20R/DSI_Intro_to_R_Workshop.ipynb",
                    "Intro to Web Scraping": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro%20to%20Web%20Scraping/intro_to_webscraping.ipynb",
                    "Introduction to C": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro_C/IntroToC.ipynb",
                    "GPU Accelerated Scientific Computing": "https://github.com/matheusmaldaner/WorkshopArchive/blob/main/Workshops/Intro_GPU/IntroToGPUAcceleratedScientificComputing.ipynb",
                    "AI Chronicles": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/AI_Chronicles",
                    "Applied Machine Learning": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Applied_ML",
                    "Convolutional Neural Networks": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/CNNS",
                    "Git and Github": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Git",
                    "Language Models": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/LanguageModels",
                    "NumPy and MatPlotLib": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/NumPy%20&%20MatPlotLib",
                    "Pandas": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Pandas",
                    "Power BI": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Power%20BI",
                    "PyTorch": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/PyTorch",
                    "SQL": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/SQL%202024",
                    "Tableau": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Tableau",
                    "Sentence Transformers": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Sentence_Transformers",
                    "Intro To Neural Networks": "https://github.com/matheusmaldaner/WorkshopArchive/tree/main/Workshops/Intro%20To%20Neural%20Networks"
                  };
                  const link = links[workshop.title];
                  
                  // Different background colors for variety (like the reference image)
                  const bgColors = [
                    'bg-pink-400',
                    'bg-purple-400',
                    'bg-green-400',
                    'bg-blue-400',
                    'bg-orange-400',
                    'bg-indigo-400'
                  ];
                  const bgColor = bgColors[index % bgColors.length];
                  
                  return (
                    <div 
                      key={workshop.id} 
                      className={`group bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300 ${link ? 'cursor-pointer' : ''}`}
                      onClick={link ? () => window.open(link, '_blank', 'noopener,noreferrer') : undefined}
                    >
                      {/* Image Header */}
                      <div className={`relative h-32 ${bgColor} overflow-hidden`}>
                        <Image 
                          src={workshop.image} 
                          alt={workshop.title}
                          fill
                          className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-300"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        {/* Workshop Title */}
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                          {workshop.title}
                        </h3>
                        
                        {/* Presenter/Time */}
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {workshop.presenters}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Workshops Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg md:col-span-1">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upcoming Workshops
                </h2>
              </div>
              
              {upcomingWorkshops.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {upcomingWorkshops.map((workshop, index) => {
                    // Different background colors for variety
                    const bgColors = [
                      'bg-pink-400',
                      'bg-purple-400',
                      'bg-green-400',
                      'bg-blue-400',
                      'bg-orange-400',
                      'bg-indigo-400'
                    ];
                    const bgColor = bgColors[index % bgColors.length];
                    
                    return (
                      <div 
                        key={workshop.id} 
                        className="group bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300"
                      >
                        {/* Image Header */}
                        <div className={`relative h-32 ${bgColor} overflow-hidden`}>
                          {workshop.image && (
                            <Image 
                              src={workshop.image} 
                              alt={workshop.title}
                              fill
                              className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-300"
                            />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          {/* Workshop Title */}
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                            {workshop.title}
                          </h3>
                          
                          {/* Date/Time */}
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {workshop.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming workshops scheduled.</p>
                </div>
              )}
            </div>
          </div>

          {/* Partnership Workshops Section */}
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Partnership Workshops
              </h2>
              <div className="w-20 h-1 bg-teal-500 dark:bg-teal-400 rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
              {/* Image */}
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <Image 
                  src="/images/workshop/dsixufit.jpg"
                  alt="DSI and UFIT Collaboration"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              
              {/* Content */}
              <div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We collaborate with <strong className="text-gray-900 dark:text-white">UF Information Technology (UFIT)</strong> to host 
                  specialized workshops that provide students with access to cutting-edge computational resources and industry-standard training.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Our partnership workshops cover topics ranging from deep learning and AI to high-performance computing and development tools. 
                  One of our most impactful collaborations is the <strong className="text-gray-900 dark:text-white">NVIDIA Deep Learning Workshop</strong>, 
                  a comprehensive training program with certification included. Through these workshops, students gain hands-on experience with 
                  research computing infrastructure, remote development environments, and industry-standard workflows.
                </p>
                
                <Link 
                  href="https://www.rc.ufl.edu/highlight-articles/ufit-collaboration-feature.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors group"
                >
                  Read More
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ScrollUp />
    </>
  );
} 