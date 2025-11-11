'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  companyLogo?: string;
  companyLogo2?: string;
  description: string;
  time: string;
  room: string;
  track: string;
  category: 'keynote' | 'general' | 'industry' | 'research' | 'workshop';
  youtubeUrl?: string;
}

const SymposiumNew = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [filter, setFilter] = useState('All');

  // Speaker data
  const speakers: Speaker[] = [
    {
      id: 'jack-kendall',
      name: 'Jack Kendall',
      title: 'Keynote: Building Next-Generation Brain-Inspired Processors',
      company: 'RainAI',
      image: '/images/symposium-25/speakers/2025_JackKendall.jpg',
      companyLogo: '/images/symposium-25/speakers/jack_sup.png',
      description: 'Jack Kendall is the Co-Founder and current CTO of Rain AI, a company building next-generation brain-inspired processors for artificial intelligence. Jack\'s mission is to build a brain — bridging neuroscience, physics, and computing to reimagine how machines learn. His research includes highly cited papers on analog neural networks and neuromorphic architectures. Rain is backed by leading figures in AI, including Sam Altman, the CEO of OpenAI. Jack is a University of Florida alum and one of the original founders and the second President of DSI, making his keynote today a full-circle moment for the community he helped shape.',
      time: '8:00AM - 9:00AM',
      room: 'Auditorium',
      track: 'Keynote',
      category: 'keynote',
      youtubeUrl: 'https://www.youtube.com/watch?v=w5gG1SM9omM&feature=youtu.be'
    },
    {
      id: 'norman-bukingolts',
      name: 'Norman Bukingolts',
      title: 'Transforming our Humanity into Job Security',
      company: 'Association of Computing Machinery',
      image: '/images/symposium-25/speakers/norman.png',
      companyLogo: '/images/symposium-25/speakers/norman_sup.png',
      description: 'What happens when what we know isn\'t enough to be employable anymore? Amid rising layoffs in the tech industry and beyond due to the automation of labor with AI systems, stress about job security is thriving -- but hope for a meaningful, stable career is not yet lost. Attend this workshop to explore how analytical, generative, and agentic AI systems are being implemented in the modern workplace and understand their strengths and limitations. Learn about not just philosophical but technical arguments describing what exactly an AI system can and cannot provably do -- and why what makes us human is not only "marketable" but essential to the current and future workforce.',
      time: '10:30AM - 11:30AM',
      room: 'Room 2325',
      track: 'Workshop Track',
      category: 'workshop',
      youtubeUrl: 'https://www.youtube.com/watch?v=_B0peKlTk3k'
    },
    {
      id: 'hubert-wagner',
      name: 'Dr. Hubert Wagner',
      title: 'Trojan horses, Pavlov\'s dogs and self-driving cars',
      company: 'University of Florida',
      image: '/images/symposium-25/speakers/hubert.png',
      companyLogo: '/images/symposium-25/speakers/hubert_sup.png',
      description: 'While deep neural networks are powerful tools, they are known to have security issues. One particular threat is the so-called Trojan attack, which can be used to compromise, for instance, self-driving cars. I will describe our approach for detecting such attacks on vision models presented at NeurIPS\' 21. This approach is motivated by basic neuroscientific principles and uses methods of topological data analysis (TDA), which I will introduce along the way. (No previous background in topology is necessary.)',
      time: '10:30AM - 11:30AM',
      room: 'Room 2330',
      track: 'Research Track',
      category: 'research',
      youtubeUrl: 'https://www.youtube.com/watch?v=zeSrfe8ATCE'
    },
    {
      id: 'raul-valle',
      name: 'Raul Valle',
      title: 'Introduction to Signal Processing',
      company: 'IEEE Signal Processing Society',
      image: '/images/symposium-25/speakers/raul.png',
      companyLogo: '/images/symposium-25/speakers/raul_sup.png',
      description: 'Signals are how computers (and people) interpret the world. With the LLM hype calming down, we get a chance to revisit the mathematical roots of black-box machine learning in time-series problems, and learn how filters gave humanity access to computational foresight. Attend this workshop to attain mathematical insight into the complex world of signal processing from the perspective of its innovators, and learn what the future of AI beholds.',
      time: '12:45PM - 1:45PM',
      room: 'Room 2325',
      track: 'Workshop Track',
      category: 'workshop',
      youtubeUrl: 'https://www.youtube.com/watch?v=yuJaMaA18js'
    },
    {
      id: 'jacques-fleischer',
      name: 'Jacques Fleischer',
      title: 'Computer Vision and Data Annotation Workshop',
      company: 'AI Club',
      image: '/images/symposium-25/speakers/jacques.png',
      companyLogo: '/images/symposium-25/speakers/jacques_sup.png',
      description: 'Learn how to properly configure a CV model using sophisticated annotation platforms and a live demo of YOLO training. Hands-on participation where the audience can help train a gator detector model.',
      time: '3:15PM - 4:15PM',
      room: 'Room 2325',
      track: 'Workshop Track',
      category: 'workshop',
      youtubeUrl: 'https://www.youtube.com/watch?v=cSPVHXKlNFg'
    },
    {
      id: 'tony-barr',
      name: 'Tony Barr',
      title: 'Developing a Model of Reality',
      company: 'SAS Institute, AMOR',
      image: '/images/symposium-25/speakers/anthony.png',
      companyLogo: '/images/symposium-25/speakers/anthony_sup.png',
      companyLogo2: '/images/symposium-25/speakers/anthony_sup2.png',
      description: 'Tony Barr will discuss the early history of the SAS system for data analytics and his current work, A Model Of Reality (AMOR). AMOR aims to create a world where young children and adults can understand and flourish in programming, databases, mathematics, and data analytics. AMOR uses diagrams and flowcharts to make reading and writing programs easy and intuitive for learners and seasoned users. The mission is to enable users to navigate through knowledge space naturally, as they navigate the real world.',
      time: '10:30AM - 11:30AM',
      room: 'Auditorium',
      track: 'General Track',
      category: 'general',
      youtubeUrl: 'https://www.youtube.com/watch?v=HNkhqaDkPfA&feature=youtu.be'
    },
    {
      id: 'aapo-hyvarinen',
      name: 'Dr. Aapo Hyvarinen',
      title: 'Painful Intelligence: What AI Can Tell Us About Human Suffering',
      company: 'University of Helsinki',
      image: '/images/symposium-25/speakers/aapo.png',
      companyLogo: '/images/symposium-25/speakers/aapo_sup.png',
      description: 'This talk introduces my recent e-book with the same title, freely available on arxiv. The book uses the modern theory of artificial intelligence (AI) to understand human suffering or mental pain. Both humans and sophisticated AI agents process information about the world in order to achieve goals and obtain rewards, which is why AI can be used as a model of the human brain and mind. The book starts with the assumption that suffering is mainly caused by frustration. Frustration means the failure of an agent (whether AI or human) to achieve a goal or a reward it wanted or expected. Frustration is inevitable because of the overwhelming complexity of the world, limited computational resources, and scarcity of good data. In particular, such limitations imply that an agent acting in the real world must cope with uncontrollability, unpredictability, and uncertainty, which all lead to frustration. Such computational theory is finally used to derive various interventions or training methods that will reduce suffering in humans. The ensuing interventions are very similar to those proposed by Buddhist and Stoic philosophy, and include mindfulness meditation.',
      time: '9:15AM - 10:15AM',
      room: 'Room 2330',
      track: 'Research Track',
      category: 'research',
      youtubeUrl: 'https://www.youtube.com/watch?v=Ms95e1M3ajs'
    },
    {
      id: 'megan-higgs',
      name: 'Dr. Megan Higgs',
      title: 'Pausing to Take a Deeper Look at Assumptions',
      company: 'Critical Inference',
      image: '/images/symposium-25/speakers/megan.png',
      companyLogo: '/images/symposium-25/speakers/megan_sup.png',
      description: 'Assumptions are a necessary part of making conclusions and inferences from data. Formal training in Statistics and data science tends to encourage a mathematical and automatic treatment of assumptions, with relatively low expectations for justifying assumptions in the context of the problem or conveying the extent to which conclusions are conditional on assumptions. With so much focus on methods and computing, it is important to also take time to step back and more deeply consider the layers of assumptions that make up the foundation of any data analysis. I believe statisticians and data scientists have a responsibility to better convey the conditional nature of results, and to work with subject matter experts to translate and interrogate assumptions within a particular scientific context. While this is challenging in most problems, it is a necessary step toward better justifying the use of, and trust in, statistical results. The goal of this high-level talk is to increase, or re-highlight, awareness and spur discussion about related challenges and strategies.',
      time: '3:15PM - 4:15PM',
      room: 'Auditorium',
      track: 'General Track',
      category: 'general',
      youtubeUrl: 'https://www.youtube.com/watch?v=TBwZKeyi3JY'
    },
    {
      id: 'jim-hoover',
      name: 'Dr. Jim Hoover',
      title: 'The Latest Developments in the Implementation of AI in Business',
      company: 'University of Florida',
      image: '/images/symposium-25/speakers/jim.png',
      companyLogo: '/images/symposium-25/speakers/jim_sup.png',
      description: 'Ever since November 2022 when ChatGPT was released commercially, businesses have been pursuing the best approaches to implement AI into their processes. There has been a great deal of Fear of Missing Out (FOMO) related to this quest for value out of AI capabilities. In this talk, we will discuss what is working and what is not. And, we will explore how students can best position themselves for roles in AI as the technology continues to evolve in business.',
      time: '12:45PM - 1:45PM',
      room: 'Auditorium',
      track: 'General Track',
      category: 'general',
      youtubeUrl: 'https://www.youtube.com/watch?v=MFD3K_zR6NM'
    },
    {
      id: 'andrew-gelman',
      name: 'Dr. Andrew Gelman',
      title: 'Principles of Bayesian Workflow',
      company: 'Columbia University',
      image: '/images/symposium-25/speakers/andrew.png',
      companyLogo: '/images/symposium-25/speakers/andrew_sup.png',
      description: 'The Bayesian approach to data analysis provides a powerful way to handle uncertainty in all observations, model parameters, and model structure using probability theory. Probabilistic programming languages make it easier to specify and fit Bayesian models, but this still leaves us with many options regarding constructing, evaluating, and using these models, along with many remaining challenges in computation. Using Bayesian inference to solve real-world problems requires not only statistical skills, subject matter knowledge, and programming, but also awareness of the decisions made in the process of data analysis. All of these aspects can be understood as part of a tangled workflow of applied Bayesian statistics. Beyond inference, the workflow also includes iterative model building, model checking, validation and troubleshooting of computational problems, model understanding, and model comparison. We review all these aspects of workflow in the context of several examples, keeping in mind that in practice we will be fitting many models for any given problem, even if only a subset of them will ultimately be relevant for our conclusions.',
      time: '12:45PM - 1:45PM',
      room: 'Room 2330',
      track: 'Research Track',
      category: 'research',
      youtubeUrl: 'https://www.youtube.com/watch?v=slFGYV5BUVA'
    },
    {
      id: 'jhonathan-herrera',
      name: 'Jhonathan Herrera',
      title: 'Intro to State Space Models and MAMBA',
      company: 'Colorstack',
      image: '/images/symposium-25/speakers/jhonathan.png',
      companyLogo: '/images/symposium-25/speakers/jhonathan_sup.png',
      description: 'This introduction workshop will provide you a foundational understanding of State Space Models (SSMs) and their applications in time-series modeling.',
      time: '9:15AM - 10:15AM',
      room: 'Room 2325',
      track: 'Workshop Track',
      category: 'workshop',
      youtubeUrl: 'https://www.youtube.com/watch?v=o6ArpL4QTPo'
    },
    {
      id: 'kausthubh-konuru',
      name: 'Kausthubh Konuru',
      title: 'Introduction to NLP: Embedding Techniques for Healthcare Applications',
      company: 'American Statistical Association',
      image: '/images/symposium-25/speakers/kausthubh.png',
      companyLogo: '/images/symposium-25/speakers/kausthubh_sup.png',
      description: 'This workshop introduces fundamental Natural Language Processing concepts through the lens of medical text embeddings. Participants will learn how to transform unstructured clinical text into meaningful vector representations. We cover text preprocessing techniques, tokenization, normalization, and various embedding methods from statistical approaches to neural representations.',
      time: '2:00PM - 3:00PM',
      room: 'Room 2325',
      track: 'Workshop Track',
      category: 'workshop',
      youtubeUrl: 'https://www.youtube.com/watch?v=XuEAsw302hs&feature=youtu.be'
    },
    {
      id: 'carlos-bastos',
      name: 'Carlos Bastos Neto',
      title: 'Living a Life within Big Tech',
      company: 'Google Cloud',
      image: '/images/symposium-25/speakers/carlos.png',
      companyLogo: '/images/symposium-25/speakers/carlos_sup.png',
      description: 'With over two decades at Microsoft and Google, Carlos offers an inside look at building a career across the world\'s top tech companies. He\'ll share lessons on leadership, navigating industry shifts, and what it truly means to drive innovation and transformation at scale.',
      time: '9:15AM - 10:15AM',
      room: 'Room 2335',
      track: 'Industry Track',
      category: 'industry',
      youtubeUrl: 'https://www.youtube.com/watch?v=zIQfTEIub5o'
    },
    {
      id: 'luciane-galuppo',
      name: 'Luciane Galuppo',
      title: 'Lessons from 30 years at Microsoft',
      company: 'Microsoft',
      image: '/images/symposium-25/speakers/luciane.png',
      companyLogo: '/images/symposium-25/speakers/luciane_sup.png',
      description: 'In this reflective talk, Luciane shares key lessons from her three-decade journey at Microsoft—from career milestones to daily life in tech. She\'ll touch on the evolution of the IT industry, her core values, and practical advice for navigating a successful and fulfilling career in tech.',
      time: '10:30AM - 11:30AM',
      room: 'Room 2335',
      track: 'Industry Track',
      category: 'industry',
      youtubeUrl: 'https://www.youtube.com/watch?v=IwLmN4V-DkQ'
    },
    {
      id: 'tyler-richards',
      name: 'Tyler Richards',
      title: 'Overcoming Rejection as an Aspiring Data Scientist',
      company: 'Snowflake, Ex-Meta',
      image: '/images/symposium-25/speakers/tyler.png',
      companyLogo: '/images/symposium-25/speakers/tyler_sup.png',
      description: 'In this talk, Tyler shares lessons learned from his journey breaking into data science—from early rejections to landing roles at Facebook, Streamlit, and Snowflake. He\'ll offer practical tips for staying resilient, building projects that stand out, and navigating an unpredictable career path with curiosity and creativity.',
      time: '2:00PM - 3:00PM',
      room: 'Room 2335',
      track: 'Industry Track',
      category: 'industry',
      youtubeUrl: 'https://www.youtube.com/watch?v=OeU40fcfOis'
    },
    {
      id: 'michael-vega',
      name: 'Michael Vega-Sanz',
      title: 'You Can Just Do Things',
      company: 'Gail',
      image: '/images/symposium-25/speakers/michael.png',
      companyLogo: '/images/symposium-25/speakers/michael_sup.png',
      description: 'Michael shares the story of how he launched two high-growth startups—first LULA, then Gail—starting from his college dorm room. Through candid reflections on risk-taking, building in regulated industries, and lessons from the journey, he\'ll inspire you to stop waiting for permission and start building.',
      time: '9:15AM - 10:15AM',
      room: 'Auditorium',
      track: 'General Track',
      category: 'general',
      youtubeUrl: 'https://www.youtube.com/watch?v=i6DQyGf_g9A&feature=youtu.be'
    },
    {
      id: 'wesley-deng',
      name: 'Wesley Deng',
      title: 'Supporting Responsible AI on the ground',
      company: 'Carnegie Mellon University',
      image: '/images/symposium-25/speakers/wesley.png',
      companyLogo: '/images/symposium-25/speakers/wesley_sup.png',
      description: 'As artificial intelligence (AI) becomes increasingly integrated into products and services across industries, ensuring its responsible development and deployment has become a critical challenge. Several tools, processes, and principles have been developed to support responsible AI (RAI) in industry practice. However, research has shown a persistent gap between the aspirational goals of these RAI interventions and the practical realities faced by practitioners tasked with designing and building responsible AI systems. In this talk, I will first present a set of insights gained from empirical studies with industry RAI practitioners. I will then share a series of tools and processes designed to better support RAI practices in real-world industry settings—particularly in the contexts of AI auditing, red-teaming, and impact assessment. Finally, I will briefly discuss future directions for research, practice, and policy in building safe and responsible AI within industry.',
      time: '2:00PM - 3:00PM',
      room: 'Room 2330',
      track: 'Research Track',
      category: 'research'
    },
    {
      id: 'sarah-luger',
      name: 'Dr. Sarah K Luger',
      title: 'AI: trends, data, and low-resource languages',
      company: 'ML Commons',
      image: '/images/symposium-25/speakers/sarah.png',
      companyLogo: '/images/symposium-25/speakers/sarah_sup.png',
      description: 'Drawing from over 20 years in AI and NLP, Sarah explores emerging trends in generative AI, the challenges of building inclusive datasets, and the importance of supporting low-resource languages. With insights from both industry and research—including her work on IBM Watson\'s Jeopardy! Challenge—she highlights how responsible AI depends on diverse data, ethical practices, and a balance between scientific rigor and creativity.',
      time: '2:00PM - 3:00PM',
      room: 'Auditorium',
      track: 'General Track',
      category: 'general'
    },
    {
      id: 'antonio-knez',
      name: 'Antonio Knez',
      title: 'Open and Loyal AGI for Everyone',
      company: 'Sentient Foundation',
      image: '/images/symposium-25/speakers/antonio.png',
      companyLogo: '/images/symposium-25/speakers/antonio_sup.png',
      description: 'The presentation will talk about Sentient\'s general mission and goal while presenting what we have done so far. It will also mention the builder grant program that we recently launched, which might be interesting to student developers.',
      time: '12:45PM - 1:45PM',
      room: 'Room 2335',
      track: 'Industry Track',
      category: 'industry',
      youtubeUrl: 'https://www.youtube.com/watch?v=m-QS8uFNYcY'
    },
    {
      id: 'olivia-dizon',
      name: 'Dr. Olivia Dizon-Paradis',
      title: 'Intro to AI Research',
      company: 'University of Florida',
      image: '/images/symposium-25/speakers/olivia.png',
      companyLogo: '/images/symposium-25/speakers/olivia_sup.png',
      description: 'This talk will go over an AI crash course, AI research in practice, and tools and resources for getting started with AI research.',
      time: '3:15PM - 4:15PM',
      room: 'Room 2335',
      track: 'Industry Track',
      category: 'industry'
    },
    {
      id: 'stephen-wormald',
      name: 'Stephen Wormald',
      title: 'RAPID-XAI - Toward Explainable Models with Single-Cycle Inference',
      company: 'University of Florida',
      image: '/images/symposium-25/speakers/stephen.png',
      companyLogo: '/images/symposium-25/speakers/stephen_sup.png',
      description: 'This talk explores how we can make AI systems faster and easier to understand by bridging explainability and performance. It introduces a new framework that integrates logic-based neural models with custom hardware acceleration to enable single-cycle inference. Through this approach, the talk demonstrates how we can build AI systems that are not only highly interpretable but also capable of operating in real-time environments.',
      time: '3:15PM - 4:15PM',
      room: 'Room 2330',
      track: 'Research Track',
      category: 'research'
    }
  ];

  const categories = ['All', 'Keynote', 'General Track', 'Industry Track', 'Research Track', 'Workshop Track'];
  
  // Helper function to convert time to minutes for sorting
  const timeToMinutes = (timeStr: string) => {
    const startTime = timeStr.split(' - ')[0];
    
    // Handle AM/PM format
    const isAM = startTime.includes('AM');
    const isPM = startTime.includes('PM');
    
    const timeOnly = startTime.replace(/[AP]M/g, '');
    const [hours, minutes] = timeOnly.split(':').map(Number);
    
    let adjustedHours = hours;
    if (isPM && hours !== 12) {
      adjustedHours = hours + 12;
    } else if (isAM && hours === 12) {
      adjustedHours = 0;
    }
    
    return adjustedHours * 60 + minutes;
  };

  // Sort speakers chronologically by their session time (earliest first)
  const sortedSpeakers = [...speakers].sort((a, b) => {
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });
  
  // Filter speakers and maintain chronological order
  const filteredSpeakers = filter === 'All' 
    ? sortedSpeakers 
    : sortedSpeakers.filter(speaker => speaker.track === filter);

  // Category badge component
  const CategoryBadge = ({ category, track }: { category: string; track?: string }) => {
    const categoryColors = {
      'keynote': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      'general': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'industry': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'research': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'workshop': 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
        {category === 'keynote' ? 'Keynote Speaker' : track || category}
      </span>
    );
  };

  // Speaker card component
  const SpeakerCard = ({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) => (
    <article 
      className="group cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={speaker.image}
            alt={speaker.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <CategoryBadge category={speaker.category} track={speaker.track} />
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {speaker.time} • {speaker.room}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {speaker.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
            {speaker.company}
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {speaker.title}
          </p>
        </div>
      </div>
    </article>
  );

  // Keynote speaker component
  const KeynoteSpeaker = ({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) => (
    <article 
      className="group cursor-pointer transition-all duration-300 mb-12"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-purple-200 dark:border-purple-800">
        <div className="md:flex">
          <div className="md:w-1/3 relative h-64 md:h-80">
            <Image
              src={speaker.image}
              alt={speaker.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="mb-4">
              <CategoryBadge category={speaker.category} track={speaker.track} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors duration-200">
              {speaker.name}
            </h2>
            
            <p className="text-lg text-purple-600 dark:text-purple-400 mb-4 font-medium">
              {speaker.company}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {speaker.title}
            </h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              📅 {speaker.time} • 📍 {speaker.room}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
              {speaker.description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );

  // Add Escape key handler to close modal
  useEffect(() => {
    if (!selectedSpeaker) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSpeaker(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSpeaker]);

  const keynoteSpeaker = sortedSpeakers.find(s => s.category === 'keynote');
  const regularSpeakers = sortedSpeakers.filter(s => s.category !== 'keynote');

  return (
    <div className="min-h-screen  ">
      {/* Header Section */}
      <section className="relative z-10 overflow-hidden pb-0 pt-10 ">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[900px] text-center mb-12">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
              DSI Spring Symposium 2025
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 px-4 mb-8">
              Join us for a day of learning, networking, and innovation with industry leaders, researchers, and innovators in AI and data science.
            </p>
            
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">📅 Date</div>
                <div className="text-gray-900 dark:text-white font-semibold">April 5, 2025</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">📍 Location</div>
                <div className="text-gray-900 dark:text-white font-semibold">Reitz Union, UF</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">👥 Speakers</div>
                <div className="text-gray-900 dark:text-white font-semibold">{speakers.length} Experts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keynote Speaker Section */}
      {keynoteSpeaker && (
        <section className="pt-8 pb-6 md:pb-8  ">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Keynote Speaker
            </h2>
            <KeynoteSpeaker
              speaker={keynoteSpeaker}
              onClick={() => setSelectedSpeaker(keynoteSpeaker)}
            />
          </div>
        </section>
      )}

      {/* Speakers Grid */}
      <section className="pt-6 md:pt-8 pb-12 md:pb-16  ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              All Speakers
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onClick={() => setSelectedSpeaker(speaker)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Collaborators & Sponsors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Speaker Affiliations</h3>
              <div className=" dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <Image
                  src="/images/symposium-25/collaborators/speaker-affiliations.png"
                  alt="Speaker Affiliations"
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Workshop Organizations</h3>
              <div className=" dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <Image
                  src="/images/symposium-25/collaborators/workshop-orgs.png"
                  alt="Workshop Organizations"
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Sponsors */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">Our Sponsors</h3>
            <div className=" dark:bg-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                <Image src="/images/symposium-25/sponsors/AIIRI.png" alt="AIIRI" width={120} height={60} className="opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/images/symposium-25/sponsors/CISE.png" alt="CISE" width={120} height={60} className="opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/images/symposium-25/sponsors/AI2.png" alt="AI2" width={120} height={60} className="opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/images/symposium-25/sponsors/smathers.png" alt="Smathers" width={120} height={60} className="opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Modal */}
      {selectedSpeaker && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full p-2 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Speaker Image and Header */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={selectedSpeaker.image}
                  alt={selectedSpeaker.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* YouTube Recording Link */}
                {selectedSpeaker.youtubeUrl && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <a
                      href={selectedSpeaker.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Recording"
                      className="inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <span className="text-xs font-medium text-white bg-black/60 rounded px-2 py-1 select-none pointer-events-none">Recording</span>
                  </div>
                )}
                {/* Company/Affiliation Logos Bottom Right */}
                {(selectedSpeaker.companyLogo || selectedSpeaker.companyLogo2) && (
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
                    {selectedSpeaker.companyLogo && (
                      <Image
                        src={selectedSpeaker.companyLogo}
                        alt="Company logo"
                        width={112}
                        height={56}
                        className="h-14 w-auto bg-white/80 rounded shadow p-2"
                        style={{ maxWidth: 160, maxHeight: 64 }}
                      />
                    )}
                    {selectedSpeaker.companyLogo2 && (
                      <Image
                        src={selectedSpeaker.companyLogo2}
                        alt="Additional company logo"
                        width={112}
                        height={56}
                        className="h-14 w-auto bg-white/80 rounded shadow p-2"
                        style={{ maxWidth: 160, maxHeight: 64 }}
                      />
                    )}
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-16">
                  <CategoryBadge category={selectedSpeaker.category} track={selectedSpeaker.track} />
                  <h1 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-2">
                    {selectedSpeaker.name}
                  </h1>
                  <p className="text-lg text-blue-200 mb-2">
                    {selectedSpeaker.company}
                  </p>
                  <div className="text-white/90 text-sm">
                    📅 {selectedSpeaker.time} • 📍 {selectedSpeaker.room}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedSpeaker.title}
                </h2>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedSpeaker.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymposiumNew;
