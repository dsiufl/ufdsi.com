'use client';

import { Speaker } from "@/types/db";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryBadge from "@/components/CategoryBadge";
export default function SpeakerCard({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) {
    const [ imageLoading, setImageLoading ] = useState(true);
    return (
      <article 
        className="group cursor-pointer transition-all duration-300"
        onClick={onClick}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="relative h-48 overflow-hidden">
            {imageLoading && <Skeleton className='size-full' />}
            <Image
              src={speaker.cover}
              alt={speaker.name}
              fill
              className={`object-cover ${imageLoading ? 'size-0' : ''} transition-transform duration-300 group-hover:scale-105`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoadStart={() => {
                setImageLoading(true);
                console.log(`Started loading image for speaker: ${speaker.name}`);
              }}
              onLoad={() => {
                setImageLoading(false);
                console.log('Loading complete for speaker:', speaker.name);
              }}
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
  };