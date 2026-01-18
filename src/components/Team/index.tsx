'use client';
import { supabase } from "@/lib/main";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";

type Person = {
  name: string;
  position?: string;
  linkedin?: string;
  image?: string;
};

type JuniorRole = {
  title: string;
  members: Person[];
};


const PersonCard = ({ person }: { person: Person }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl group hover:translate-y-[-5px] w-full max-w-[280px]">
    <div className="h-56 w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      <img
        src={person.image || "https://via.placeholder.com/280x224"}
        alt={person.name}
        className="w-full h-full object-cover object-center"
      />
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{person.name}</h3>
      {person.position && (
        <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900 px-3 py-1 text-sm font-medium text-teal-800 dark:text-teal-300 mb-4">
          {person.position}
        </span>
      )}
      <div className="flex items-center mt-4">
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm"
          >
            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
        )}
      </div>
    </div>
  </div>
);



const Team = () => {
  const [users, setUsers] = useState<any[]>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    supabase.from('board').select().eq('year',2026).then((data) => {
      setUsers(data.data)
      setLoaded(true);
    })
  }, [])
  

  const juniorRoles2025 = [
    'Technology Coordinators',
    'Workshop Coordinators',
    'Marketing Coordinators',
    'Sponsorship Coordinators',
    'Networking Coordinators',
    'Event Coordinators'
  ]
  return !loaded ? <div className="w-full flex justify-center"><Spinner className="size-24 relative flex self-center" /></div>: (
    <div className="fadein">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
       
        
        {/* Apply Button Section */}
        <div className="text-center mb-12">
          <a
            href="https://docs.google.com/forms/d/14uJf3UNJi9ZuthZEqEbviMXknrCUhTcz0QYPPFlynUc/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-teal-600 hover:to-blue-600"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Interested in Applying?
          </a>
        </div>

        {/* Section for Executives */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white inline-block relative">
              Executive Board
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500"></span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
            { 
              users && users.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() ).filter(s => s.exec).map((data, index) => (
                <PersonCard key={`exec-${index}`} person={{
                  name: data.name,
                  position: data.role,
                  linkedin: data.linkedin,
                  image: data.headshot
                }} />
              ))
            }
          </div>
        </div>

        {/* Section for Junior Roles (2025-2026) */}
        <div className="mb-12">
          {juniorRoles2025.map((role, roleIndex) => (
            <div key={roleIndex} className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white inline-block relative">
                  {role}
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500"></span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
                {users && users.filter(s => role.includes(s.role)).map((data, personIndex) => (
                      <PersonCard key={`${roleIndex}-${personIndex}`} person={{
                      name: data.name,
                      linkedin: data.linkedin,
                      image: data.headshot
                    }} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Team;
