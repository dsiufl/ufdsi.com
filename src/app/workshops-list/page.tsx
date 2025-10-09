"use client";
import { useState } from "react";
import Link from "next/link";
import { Tab } from '@headlessui/react';
import { Metadata } from "next";
import Image from "next/image";
import ScrollUp from "@/components/Common/ScrollUp";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Sample workshop data - You can replace this with actual data from your API/DB
const upcomingWorkshops = [
  {
    id: 1,
    title: "Python for DS",
    date: "7th July 2025, 6-7pm",
    location: "AIIRI",
    description: "A hands-on introduction to Python for Data Science.",
    image: "/images/workshop/pyth.png",
    url: "#"
  },
  {
    id: 2,
    title: "Python for NLP",
    date: "28th July 2025, 6-7pm",
    location: "AIIRI",
    description: "Learn the basics of Natural Language Processing with Python.",
    image: "/images/workshop/nlp.jpg",
    url: "#"
  }
];

const pastWorkshops = [
  {
    id: 1,
    title: "Introduction to C",
    description: "Intro to the C Programming Language.",
    presenters: "Raul",
    image: "/images/workshop/c.jpeg"
  },
  {
    id: 2,
    title: "GPU Accelerated Scientific Computing",
    description: "Intro to GPU Accelerated Workflows.",
    presenters: "Raul",
    image: "/images/workshop/gpu.png"
  },
  {
    id: 3,
    title: "AI Chronicles",
    description: "Exploring the past, present, and future of AI.",
    presenters: "Matt, Jim, Matheus",
    image: "/images/workshop/ai.jpg"
  },
  {
    id: 4,
    title: "Applied Machine Learning",
    description: "Applied machine learning techniques.",
    presenters: "Hunor",
    image: "/images/workshop/ml.jpg"
  },
  {
    id: 5,
    title: "Convolutional Neural Networks",
    description: "Convolutional Neural Networks for image tasks.",
    presenters: "Jim, Matheus",
    image: "/images/workshop/cnn.jpg"
  },
  {
    id: 6,
    title: "Git and Github",
    description: "Essentials of Git for version control.",
    presenters: "Zach, Matheus",
    image: "/images/workshop/git.jpg"
  },
  {
    id: 7,
    title: "Language Models",
    description: "NLP and advanced language models.",
    presenters: "Sebastian, Matheus",
    image: "/images/workshop/cl.jpg"
  },
  {
    id: 8,
    title: "NumPy and MatPlotLib",
    description: "Numerical computing and data visualization.",
    presenters: "Jim, Matheus",
    image: "/images/workshop/numpy.png"
  },
  {
    id: 9,
    title: "Pandas",
    description: "Data analysis with Pandas.",
    presenters: "Marielle",
    image: "/images/workshop/pandas.png"
  },
  {
    id: 10,
    title: "Power BI",
    description: "Data insights using Power BI.",
    presenters: "Marc",
    image: "/images/workshop/pbi.jpeg"
  },
  {
    id: 11,
    title: "PyTorch",
    description: "Deep learning with PyTorch.",
    presenters: "Jim, Matheus",
    image: "/images/workshop/pytorch.jpg"
  },
  {
    id: 12,
    title: "SQL",
    description: "SQL database manipulation and querying.",
    presenters: "Marc",
    image: "/images/workshop/sql.jpeg"
  },
  {
    id: 13,
    title: "Tableau",
    description: "Data insights using Tableau.",
    presenters: "Kyle",
    image: "/images/workshop/tb.png"
  },
  {
    id: 14,
    title: "Sentence Transformers",
    description: "Using Sentence Transformers for Semantic Search.",
    presenters: "Tristan",
    image: "/images/workshop/tf.png"
  },
  {
    id: 15,
    title: "Intro To Neural Networks",
    description: "Algorithms needed for Neural Networks",
    presenters: "Ishan",
    image: "/images/workshop/nn.jpg"
  }
];

export default function WorkshopsPage() {
  const [categories] = useState({
    "Upcoming Workshops": upcomingWorkshops,
    "Past Workshops": pastWorkshops,
  });

  return (
    <>
        <div className="container p-4 mx-auto">
          <div className="mx-auto max-w-[800px] text-center mb-12">
            <h1>Workshops & Training</h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 px-4">
              Expand your skills with our specialized workshops in data science, machine learning, 
              and related fields. Browse our upcoming and past workshops below.
            </p>
          </div>

          <div className="mx-auto w-full max-w-6xl px-4">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800 mb-8">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-3 text-lg font-medium leading-5',
                        'ring-white/60 ring-offset-2 ring-offset-teal-400 focus:outline-none',
                        selected
                          ? 'bg-white text-teal-600 shadow dark:bg-gray-700 dark:text-teal-400'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400'
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {/* Upcoming Workshops Panel */}
                <Tab.Panel
                  className={classNames(
                    'rounded-xl p-3',
                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                  )}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {upcomingWorkshops.map((workshop) => (
                      <div 
                        key={workshop.id} 
                        className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700"
                      >
                        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                          <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            {workshop.location}
                          </div>
                          {workshop.image && (
                            <div className="h-full w-full relative">
                              <Image 
                                src={workshop.image} 
                                alt={workshop.title}
                                fill
                                className="transition-all duration-300 hover:scale-105"
                                style={{ filter: "grayscale(50%)", objectFit: "cover" }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="mb-2 flex items-center">
                            <span className="text-xs font-semibold uppercase tracking-wide text-teal-500 dark:text-teal-400">
                              {workshop.date}
                            </span>
                          </div>
                          <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                            {workshop.title}
                          </h3>
                          <p className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
                            {workshop.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>

                {/* Past Workshops Panel */}
                <Tab.Panel
                  className={classNames(
                    'rounded-xl p-3',
                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                  )}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pastWorkshops.map((workshop) => {
                      // Special links for each workshop
                      const links = {
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
                      const cardContent = (
                        <div 
                          key={workshop.id} 
                          className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700 cursor-pointer"
                        >
                          <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                            <Image 
                              src={workshop.image} 
                              alt={workshop.title}
                              fill
                              className="transition-all duration-300 hover:scale-105"
                              style={{ filter: "grayscale(50%)", objectFit: "cover" }}
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                              {workshop.title}
                            </h3>
                            <p className="mb-2 text-gray-600 dark:text-gray-300 text-sm">
                              {workshop.description}
                            </p>
                            <div className="text-xs font-semibold text-teal-500 dark:text-teal-400">
                              {workshop.presenters}
                            </div>
                          </div>
                        </div>
                      );
                      return link ? (
                        <a
                          key={workshop.id}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          {cardContent}
                        </a>
                      ) : cardContent;
                    })}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-[600px] rounded-lg bg-gray-50 p-8 shadow-lg dark:bg-gray-800">
              <Link
                href="/contact"
                className="inline-block rounded-lg bg-teal-500 px-6 py-3 text-center text-base font-medium text-white transition-colors duration-300 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      <ScrollUp />
    </>
  );
} 