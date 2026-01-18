'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Speaker {
  id: number;
  created_at: Date;
  name: string;
  affiliation: string;
  title: string;
  time: string;
  location: string;
  cover: string;
  symposium: number;
  description: string;
  affiliated_logo?: string;
  youtube?: string;
  track: string;
  category: 'keynote' | 'general' | 'industry' | 'research' | 'workshop';
}
interface Symposium {
  id: number;
  keynote: number;
  date: Date;
}

const SymposiumNew = ({speakers, symposium}: {speakers: Speaker[], symposium: Symposium}) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [filter, setFilter] = useState('All');

  // Speaker data
  

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
            src={speaker.cover}
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
              {speaker.time} • {speaker.location}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {speaker.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
            {speaker.affiliation}
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
              src={speaker.cover}
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
              {speaker.affiliation}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {speaker.title}
            </h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              📅 {speaker.time} • 📍 {speaker.location}
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

  const keynoteSpeaker = sortedSpeakers.find(s => s.id === symposium.keynote);
  const regularSpeakers = sortedSpeakers.filter(s => s.category !== 'keynote');
  return (
    <div className="min-h-screen  ">
      {/* Header Section */}
      <section className="relative z-10 overflow-hidden pb-0">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[900px] text-center mb-12">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
              DSI Spring Symposium {new Date(symposium.date).getFullYear()}
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 px-4 mb-8">
              Join us for a day of learning, networking, and innovation with industry leaders, researchers, and innovators in AI and data science.
            </p>
            
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">📅 Date</div>
                <div className="text-gray-900 dark:text-white font-semibold">{new Date(symposium.date).toLocaleDateString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</div>
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
                  src={selectedSpeaker.cover}
                  alt={selectedSpeaker.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* YouTube Recording Link */}
                {selectedSpeaker.youtube && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <a
                      href={selectedSpeaker.youtube}
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
                {(selectedSpeaker.affiliated_logo) && (
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
                    {selectedSpeaker.affiliated_logo && (
                      <Image
                        src={selectedSpeaker.affiliated_logo}
                        alt="Company logo"
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
                    {selectedSpeaker.affiliation}
                  </p>
                  <div className="text-white/90 text-sm">
                    📅 {selectedSpeaker.time} • 📍 {selectedSpeaker.location}
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
