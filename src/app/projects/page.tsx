'use client';

import { useState, useEffect, useMemo } from 'react';
import { sortedProjects, categories, allTechStack, StudentProject } from '@/data/student-projects';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utilities & Components ---

const CATEGORY_COLORS: Record<string, string> = {
  'Healthcare': 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
  'Fintech': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
  'Sustainability': 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800',
  'Mobility': 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800',
  'Education': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800',
  'Productivity': 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800',
  'Entertainment': 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-100 dark:border-fuchsia-800',
  'Social': 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800',
};

const getGradient = (category: string) => {
  const map: Record<string, string> = {
    'Healthcare': 'from-rose-500 to-orange-400',
    'Fintech': 'from-emerald-500 to-teal-400',
    'Sustainability': 'from-teal-500 to-green-400',
    'Mobility': 'from-indigo-500 to-blue-400',
    'Education': 'from-amber-500 to-yellow-400',
    'Productivity': 'from-violet-500 to-purple-400',
    'Entertainment': 'from-fuchsia-500 to-pink-400',
    'Social': 'from-sky-500 to-blue-400',
  };
  return map[category] || 'from-gray-500 to-slate-400';
};

// --- Icons ---
const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// --- Components ---

const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}>
    {children}
  </span>
);

const ProjectModal = ({ project, onClose }: { project: StudentProject; onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header Image/Gradient */}
        <div className={`h-48 sm:h-64 w-full bg-gradient-to-br ${getGradient(project.category)} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10">
                 {project.category}
               </span>
               {project.featured && (
                 <span className="px-2 py-1 rounded bg-yellow-400/20 backdrop-blur-md text-yellow-100 text-xs font-medium border border-yellow-400/30">
                   Featured
                 </span>
               )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{project.projectTitle}</h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Student</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{project.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Submitted</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {new Date(project.dateSubmitted).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              {project.longDescription}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <Badge key={tech} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Code
              </a>
            )}
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BentoCard = ({ project, onClick, className = "" }: { project: StudentProject; onClick: () => void; className?: string }) => {
  // Determine card size based on description length or featured status
  // Featured = Large (col-span-2 row-span-2)
  // Long description but not featured = Wide (col-span-2)
  // Standard = Square (col-span-1)
  
  const isFeatured = project.featured;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Featured Gradient Background for large cards */}
      {isFeatured && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(project.category)} opacity-[0.03] dark:opacity-[0.05] transition-opacity group-hover:opacity-10`} />
      )}

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <Badge className={CATEGORY_COLORS[project.category] || 'bg-gray-100 text-gray-600'}>
            {project.category}
          </Badge>
          <motion.div 
            className="text-zinc-300 dark:text-zinc-600 group-hover:text-primary dark:group-hover:text-white transition-colors"
            whileHover={{ rotate: 45 }}
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.div>
        </div>

        <div className="flex-grow">
          <h3 className={`font-bold text-zinc-900 dark:text-zinc-50 mb-2 ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
            {project.projectTitle}
          </h3>
          <p className={`text-zinc-500 dark:text-zinc-400 line-clamp-3 ${isFeatured ? 'text-lg' : 'text-sm'}`}>
            {project.description}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${getGradient(project.category)}`}>
               {project.studentName.charAt(0)}
             </div>
             <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[120px]">
               {project.studentName}
             </span>
           </div>
           
           <div className="flex -space-x-1 overflow-hidden">
             {project.techStack.slice(0, 3).map((tech, i) => (
               <div key={tech} className="inline-block w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-white dark:border-zinc-900 flex items-center justify-center" title={tech}>
                 <span className="text-[10px] text-zinc-500">{tech.charAt(0)}</span>
               </div>
             ))}
             {project.techStack.length > 3 && (
               <div className="inline-block w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-white dark:border-zinc-900 flex items-center justify-center">
                 <span className="text-[8px] text-zinc-500">+{project.techStack.length - 3}</span>
               </div>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return sortedProjects.filter(project => {
      const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter;
      const matchesTech = techFilter === 'All' || project.techStack.includes(techFilter);
      const matchesSearch = searchQuery === '' || 
        project.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesTech && matchesSearch;
    });
  }, [categoryFilter, techFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white"
          >
            Student <span className="text-zinc-400 dark:text-zinc-600">Showcase</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl"
          >
            Discover the next generation of data scientists and engineers. 
            A collection of innovative projects built by the UF DSI community.
          </motion.p>
        </div>
      </section>

      {/* Controls */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8 max-w-7xl mx-auto pointer-events-none">
         <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-lg shadow-zinc-200/10 dark:shadow-none flex flex-col md:flex-row gap-2 pointer-events-auto"
         >
           {/* Search */}
           <div className="relative flex-1">
             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
             <input 
               type="text"
               placeholder="Search projects..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-transparent pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:bg-zinc-50 dark:focus:bg-zinc-800 transition-colors placeholder:text-zinc-400 text-zinc-900 dark:text-white"
             />
           </div>
           
           <div className="h-px md:h-auto w-full md:w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

           {/* Filters */}
           <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl px-3 py-2.5 text-sm font-medium outline-none cursor-pointer transition-colors border-none ring-0 text-zinc-600 dark:text-zinc-400"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                className="bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl px-3 py-2.5 text-sm font-medium outline-none cursor-pointer transition-colors border-none ring-0 text-zinc-600 dark:text-zinc-400"
              >
                <option value="All">All Tech</option>
                {allTechStack.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
           </div>
         </motion.div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[320px] grid-flow-dense">
              {filteredProjects.map((project) => (
                <BentoCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  className={
                    project.featured 
                      ? "md:col-span-2 md:row-span-2" 
                      : "col-span-1 row-span-1"
                  }
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="inline-block p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
                <SearchIcon className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No projects found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setTechFilter('All'); }}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Submit CTA */}
      <section className="py-24 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
           <h2 className="block text-3xl font-bold mb-6 text-zinc-900 dark:text-white">Have a project to share?</h2>
           <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-center">
             Join other students in showcasing your work. We welcome projects from all experience levels, from class assignments to personal startups.
           </p>
           <a 
             href="https://forms.google.com" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform"
           >
             Submit Your Project
             <ArrowUpRight className="w-5 h-5" />
           </a>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
