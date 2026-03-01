'use client';

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import type { Symposium, Speaker } from '@/types/db';
import { createUserClient } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';
import CategoryBadge from '../CategoryBadge';
import SpeakerCard from './SpeakerCard';
import { AlertContext } from '@/app/AlertProvider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


const SymposiumNew = () => {
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2026');
  const [symposium, setSymposium] = useState<Symposium | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [filter, setFilter] = useState('All');
  const [showPastSymposiums, setShowPastSymposiums] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [keynoteSpeaker, setKeynoteSpeaker] = useState<Speaker | null>(null);
  const alertCtx = useContext(AlertContext);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const supabase = createUserClient();
  useEffect(() => {
    console.log("getting....")
    supabase.from('symposiums').select('*').eq('year', selectedYear).then((res) => {
      console.log(res);
      setSymposium(res.data ? res.data[0] : null);
      return res.data ? res.data[0] : null;
    }).then((symp) => {
      if (!symp) return;
      console.log(symp)
      supabase.from('speakers').select('*').eq('symposium', symp.year).then((res) => {
        setSpeakers(res.data || []);
          const sortedSpeakers = [...speakers].sort((a, b) => {
          return timeToMinutes(a.time) - timeToMinutes(b.time);
        });
        
        // Filter speakers and maintain chronological order
        const filteredSpeakers = filter === 'All' 
          ? sortedSpeakers 
          : sortedSpeakers.filter(speaker => speaker.track === filter);

        // Category badge component
        setKeynoteSpeaker(res.data ? res.data.find(s => s.id === symp.keynote) || null : null);

      });
    });
  }, [selectedYear]);


   


  // Select speakers based on selected year

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



  // Speaker card component
  

  // Keynote speaker component
  const KeynoteSpeaker = ({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) => (
    <article 
      className="group cursor-pointer transition-all duration-300 mb-12"
      onClick={onClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showPastSymposiums) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-other-symposiums]')) {
        setShowPastSymposiums(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showPastSymposiums]);

  // Close other symposiums dropdown when clicking outside
  useEffect(() => {
    if (!showPastSymposiums) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-other-symposiums]')) {
        setShowPastSymposiums(false);
      }
    };
    // Use a small delay to ensure click events on the button fire first
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPastSymposiums]);

  // Countdown timer effect
  useEffect(() => {
    if (selectedYear !== '2026') return;

    const targetDate = new Date(symposium?.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [selectedYear, symposium]);

  const regularSpeakers = speakers.filter(s => s.category !== 'keynote');
  return (
    <div className="min-h-screen  ">
      {/* Header Section */}
      {selectedYear === '2026' ? (
        // 2026 - New Fancy Layout
        <section className="relative z-10 overflow-visible pb-0 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 pt-0 pb-0">
            {/* Main Header Content - Esper Bionics Style */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-end max-w-7xl mx-auto">
              {/* Left Side - Image */}
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden order-2 md:order-1">
                <Image
                  src="/images/symposium-26/filler/3.jpg"
                  alt="Symposium 2026"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              
              {/* Right Side - Text Content */}
              <div className="md:h-[400px] flex flex-col justify-between order-1 md:order-2">
                {/* Top Section - Main Title */}
                <div className="space-y-4 relative">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight flex items-center gap-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    DSI
                    <a
                      href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=DSI+Symposium+2026&dates=20260328T090000/20260328T170000&details=DSI+Spring+Symposium+2026&location=Reitz+Union,+University+of+Florida"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 border border-red-500 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 group whitespace-nowrap"
                      title="Add to Calendar"
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-red-500 group-hover:text-red-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs md:text-sm font-medium text-red-500 group-hover:text-red-600 transition-colors">
                        Add to Calendar
                      </span>
                    </a>
                  </h1>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    SYMPOSIUM
                  </h1>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl text-blue-600 dark:text-blue-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    2026
                  </h2>
                </div>
                
                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                  Join us for a day of learning, networking, and innovation with industry leaders, researchers, and innovators in AI and data science.
                </p>
                
                {/* Info Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-medium">📅 Date:</span>
                    { symposium ? <span>{symposium && new Date(symposium.date).toLocaleDateString("en-US", {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span> : <Skeleton className="h-5 w-32" /> }
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-medium">📍 Location:</span>
                    <a href="https://www.google.com/maps/search/?api=1&query=Reitz+Union,+655+Reitz+Union+Drive,+Gainesville,+FL" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">University of Florida, 655 Reitz Union Drive</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="font-medium">👥 Speakers:</span>
                    <span>TBD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // 2025 - Original Simple Layout
        <section className="relative z-10 overflow-hidden pb-0">
          <div className="container mx-auto">
            {/* Other Symposiums Button */}
            <div className="flex justify-end mb-2 px-4" data-other-symposiums>
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPastSymposiums(!showPastSymposiums);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-colors cursor-pointer relative z-50"
                >
                  Other Symposiums
                </button>
                {showPastSymposiums && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[150px]">
                    <div className="py-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedYear('2026');
                          setShowPastSymposiums(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        2026
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                  <a 
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=DSI+Symposium+2025&dates=20250405T090000/20250405T170000&details=DSI+Spring+Symposium+2025&location=Reitz+Union,+University+of+Florida"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 hover:underline block"
                  >
                    April 5, 2025
                  </a>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">📍 Location</div>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Reitz+Union,+655+Reitz+Union+Drive,+Gainesville,+FL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-white font-semibold hover:text-green-600 dark:hover:text-green-400 hover:underline block"
                  >
                    University of Florida, 655 Reitz Union Drive
                  </a>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">👥 Speakers</div>
                  <div className="text-gray-900 dark:text-white font-semibold">{speakers.length} Experts</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Countdown Timer for 2026 */}
      {selectedYear === '2026' && (symposium ? (
              <div className="max-w-4xl mx-auto mb-0 px-4 -mt-8 md:-mt-10 pt-10 md:pt-12">
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-4 gap-4 md:gap-8">
                    <div className="text-center">
                      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-titan-one), sans-serif' }}>
                        {timeLeft.days.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Days
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-titan-one), sans-serif' }}>
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Hours
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-titan-one), sans-serif' }}>
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Minutes
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-titan-one), sans-serif' }}>
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      ) : (<Skeleton className="max-w-4xl mx-auto mb-0 px-4 pt-10 md:pt-12 h-48 mt-5" />))}

      {/* 2026 Photo Gallery */}
      {selectedYear === '2026' && (
        <section className="pt-0 pb-12 relative">
          {/* Other Symposiums Button - Above Gallery on Right */}
          <div className="flex justify-end mb-4 px-4" data-other-symposiums>
            <div className="relative z-50">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPastSymposiums(!showPastSymposiums);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-colors cursor-pointer relative z-50"
              >
                Other Symposiums
              </button>
              
              {/* Other Symposiums Dropdown */}
              {showPastSymposiums && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[150px]">
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedYear('2025');
                        setShowPastSymposiums(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      2025
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
              {[6, 2, 1, 4, 5].map((num) => (
                <div key={num} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`/images/symposium-26/filler/${num}.jpg`}
                    alt={`Symposium 2026 Photo ${num}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Keynote Speaker Section */}
      {selectedYear === '2025' && keynoteSpeaker && (
        <section className="pt-8 pb-6 md:pb-8  ">
          <div className="container mx-auto px-4">
            {/* Other Symposiums Button - Above Keynote on Right */}
            <div className="flex justify-end mb-4" data-other-symposiums>
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPastSymposiums(!showPastSymposiums);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-colors cursor-pointer relative z-50"
                >
                  Other Symposiums
                </button>
                
                {/* Other Symposiums Dropdown */}
                {showPastSymposiums && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[150px]">
                    <div className="py-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedYear('2026');
                          setShowPastSymposiums(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        2026
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
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

      {selectedYear === '2026' ? (
        <>
          {/* Speakers Title */}
          <h3 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            SPEAKERS
          </h3>


          {/* Keynote Spotlight */}
          {
            keynoteSpeaker && 
          
            <section
              className="pt-4 pb-16 md:pt-6 md:pb-20 relative overflow-hidden"
            >
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2
                    className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-12"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontWeight: 400 }}
                  >
                    Keynote Spotlight
                  </h2>
                  <div className="keynote flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
                    {/* Speaker Image */}
                    <div className="shrink-0">
                      <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                        <Image
                          src="/images/symposium-26/speakers/JohnBohannon.png"
                          alt={keynoteSpeaker.name}
                          width={320}
                          height={320}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    {/* Speaker Info */}
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                        {keynoteSpeaker.name}
                      </h3>
                      <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-5">
                        {keynoteSpeaker.affiliation}
                      </p>
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {keynoteSpeaker.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            }
            {/* Additional Speakers */}
            <section className="pb-16 md:pb-20">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-24">
                  {
                    speakers.filter(s => s.id !== symposium.keynote).map(speaker => (
                      <div key={speaker.id} className="text-center">
                        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-[6px] border-white shadow-xl mx-auto mb-4">
                          <Image
                            src={speaker.cover}
                            alt={speaker.name}
                            width={320}
                            height={320}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-4">{speaker.name}</h3>
                        <p className="text-base text-gray-600 dark:text-gray-300">{speaker.affiliation}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </section>
        </>
      ) : (
        <>
          {/* Keynote Speaker Section */}
          {keynoteSpeaker && (
            <section className="pt-8 pb-6 md:pb-8">
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
          <section className="pt-6 md:pt-8 pb-12 md:pb-16">
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

              {speakers.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {speakers.map((speaker) => (
                    <SpeakerCard
                      key={speaker.id}
                      speaker={speaker}
                      onClick={() => setSelectedSpeaker(speaker)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Skeleton className="h-48" />
                  <Skeleton className="h-48 col-span-1"/>
                  <Skeleton className="h-48" />
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Collaborators Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {selectedYear === '2025' ? (
            <>
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
            </>
          ) : (
            /* 2026 - Sponsors and Collaborators */
            <>
              {/* Sponsors */}
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  SPONSORS
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Interested in being a sponsor? Check the sponsors page!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  {/* NVIDIA */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
                    <div className="bg-white aspect-square relative p-4">
                      <Image
                        src="/images/symposium-26/sponsors/nvidia.png"
                        alt="NVIDIA"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-gray-900 dark:text-white mb-1 text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>NVIDIA</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Leader in GPU-driven AI</p>
                    </div>
                  </div>
                  
                  {/* Mark III */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
                    <div className="bg-white aspect-square relative p-4">
                      <Image
                        src="/images/symposium-26/sponsors/mark-iii.png"
                        alt="Mark III"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-gray-900 dark:text-white mb-1 text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Mark III</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Full-stack IT and AI solutions provider</p>
                    </div>
                  </div>
                  
                  {/* NLP Logix */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
                    <div className="aspect-square relative p-4" style={{ backgroundColor: '#79bc46' }}>
                      <Image
                        src="/images/symposium-26/sponsors/nlp-logix.png"
                        alt="NLP Logix"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-gray-900 dark:text-white mb-1 text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>NLP Logix</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">AI consulting firm delivering automation</p>
                    </div>
                  </div>
                  
                  {/* AIIRI */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-400 dark:border-gray-600 overflow-hidden">
                    <div className="aspect-square relative p-2" style={{ backgroundColor: '#0b2d81' }}>
                      <Image
                        src="/images/symposium-26/sponsors/aiiri.png"
                        alt="AIIRI"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-gray-900 dark:text-white mb-1 text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>AIIRI</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">UF hub advancing campus-wide AI research</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaker/Workshop Affiliations */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  SPEAKER/WORKSHOP AFFILIATIONS
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-12 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Coming Soon!</p>
                </div>
              </div>
            </>
          )}
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
