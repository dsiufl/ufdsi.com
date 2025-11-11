'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { sortedProjects, categories, allTechStack, StudentProject } from '@/data/student-projects';

const TechBadge = ({ tech }: { tech: string }) => {
  const techColors: Record<string, string> = {
    'Python': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'TensorFlow': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'PyTorch': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'React': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'AWS': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Docker': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Node.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${techColors[tech] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
      {tech}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  const categoryColors: Record<string, string> = {
    'Healthcare': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Fintech': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Sustainability': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'Mobility': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Education': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Productivity': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Entertainment': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Social': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
      {category}
    </span>
  );
};

const ProjectCard = ({ project, onClick }: { project: StudentProject; onClick: () => void }) => (
  <article 
    className="group cursor-pointer transition-all duration-300"
    onClick={onClick}
  >
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-800">
        {project.featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <CategoryBadge category={project.category} />
        </div>
        {/* Placeholder for project image - will be replaced */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 dark:from-gray-700 dark:to-gray-800">
          <div className="text-center p-4">
            <div className="text-6xl mb-2">
              {project.category === 'Healthcare' && '⚕️'}
              {project.category === 'Fintech' && '💰'}
              {project.category === 'Sustainability' && '🌱'}
              {project.category === 'Mobility' && '🚗'}
              {project.category === 'Education' && '🎓'}
              {project.category === 'Productivity' && '⚡'}
              {project.category === 'Entertainment' && '🎮'}
              {project.category === 'Social' && '👥'}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Project Screenshot</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {project.projectTitle}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          by {project.studentName}
        </p>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 3).map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
          {project.techStack.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          {project.githubLink && (
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          )}
          {project.demoLink && (
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {new Date(project.dateSubmitted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  </article>
);

const FeaturedProject = ({ project, onClick }: { project: StudentProject; onClick: () => void }) => (
  <article 
    className="group cursor-pointer transition-all duration-300 mb-12"
    onClick={onClick}
  >
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-primary/20">
      <div className="md:flex">
        <div className="md:w-2/5 relative h-64 md:h-80">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 dark:from-gray-700 dark:to-gray-800">
            <div className="text-center p-6">
              <div className="text-8xl mb-3">
                {project.category === 'Healthcare' && '⚕️'}
                {project.category === 'Fintech' && '💰'}
                {project.category === 'Sustainability' && '🌱'}
                {project.category === 'Mobility' && '🚗'}
                {project.category === 'Education' && '🎓'}
                {project.category === 'Productivity' && '⚡'}
                {project.category === 'Entertainment' && '🎮'}
                {project.category === 'Social' && '👥'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Featured Project</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/5 p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md">
              ⭐ Featured Project
            </span>
            <CategoryBadge category={project.category} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-200">
            {project.projectTitle}
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            by {project.studentName}
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            {project.githubLink && (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </span>
            )}
            {project.demoLink && (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </span>
            )}
            <span className="ml-auto text-gray-500 dark:text-gray-400">
              {new Date(project.dateSubmitted).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  </article>
);

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProjects = sortedProjects.filter(p => p.featured);
  const regularProjects = sortedProjects.filter(p => !p.featured);

  // Filter projects
  const filteredProjects = regularProjects.filter(project => {
    const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter;
    const matchesTech = techFilter === 'All' || project.techStack.includes(techFilter);
    const matchesSearch = searchQuery === '' || 
      project.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesTech && matchesSearch;
  });

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="relative z-10 overflow-hidden bg-white pb-0 pt-[120px] dark:bg-gray-dark">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[900px] text-center mb-12 px-4">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
              Student Project Showcase
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              Discover innovative data science and AI projects built by our talented members. From machine learning models to web applications, explore the cutting-edge work of UF DSI students.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sortedProjects.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{allTechStack.length}+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects, students, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="pt-8 pb-6 md:pb-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Projects
            </h2>
            {featuredProjects.map((project) => (
              <FeaturedProject
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Projects Grid with Filters */}
      <section className="pt-6 md:pt-8 pb-12 md:pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8 gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              All Projects
            </h2>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Tech Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technology
                </label>
                <select
                  value={techFilter}
                  onChange={(e) => setTechFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="All">All Technologies</option>
                  {allTechStack.map((tech) => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Submission CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Have a Project to Share?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Showcase your data science or AI project to the UF DSI community, recruiters, and potential collaborators. Submit your work today!
          </p>
          <a
            href="https://forms.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Your Project
          </a>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full p-2 transition-colors duration-200 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Project Header */}
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-gray-700 dark:to-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-9xl mb-4">
                      {selectedProject.category === 'Healthcare' && '⚕️'}
                      {selectedProject.category === 'Fintech' && '💰'}
                      {selectedProject.category === 'Sustainability' && '🌱'}
                      {selectedProject.category === 'Mobility' && '🚗'}
                      {selectedProject.category === 'Education' && '🎓'}
                      {selectedProject.category === 'Productivity' && '⚡'}
                      {selectedProject.category === 'Entertainment' && '🎮'}
                      {selectedProject.category === 'Social' && '👥'}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  {selectedProject.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg mr-2">
                      ⭐ Featured
                    </span>
                  )}
                  <CategoryBadge category={selectedProject.category} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedProject.projectTitle}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  by {selectedProject.studentName} • {new Date(selectedProject.dateSubmitted).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>

                <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <TechBadge key={tech} tech={tech} />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      View on GitHub
                    </a>
                  )}
                  {selectedProject.demoLink && (
                    <a
                      href={selectedProject.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

