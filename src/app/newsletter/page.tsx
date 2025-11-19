'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sortedArticles as articles } from './data';

const CategoryBadge = ({ category }: { category: string }) => {
  const categoryColors = {
    'Awards': 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-200',
    'Competition': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Workshop': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
      {category}
    </span>
  );
};

const ArticleCard = ({ article, onClick, isSelected }: { article: any; onClick: () => void; isSelected: boolean }) => (
  <article 
    className={`group cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-primary' : ''}`}
    onClick={onClick}
  >
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <time className="text-sm text-gray-500 dark:text-gray-400">{article.date}</time>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {article.description.split('\n')[0]}
        </p>
      </div>
    </div>
  </article>
);

const FeaturedArticle = ({ article, onClick }: { article: any; onClick: () => void }) => (
  <article 
    className="group cursor-pointer transition-all duration-300"
    onClick={onClick}
  >
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-6 left-6">
          <CategoryBadge category={article.category} />
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <time className="text-white/90 text-sm mb-2 block">{article.date}</time>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 line-clamp-2">
            {article.title}
          </h2>
        </div>
      </div>
    </div>
  </article>
);

export default function NewsletterPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState('All');
  
  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);
  
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];
  
  const filteredArticles = filter === 'All' 
    ? regularArticles 
    : regularArticles.filter(article => article.category === filter);

  // Add Escape key handler to close modal
  useEffect(() => {
    if (!selectedArticle) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  return (
    <div className="min-h-screen  ">
      {/* Header Section */}
      <section
        className="relative z-10 overflow-hidden pb-0 sm:pt-4 md:pt-8"
      >
        <div className="relative mx-auto">
          <div className="mx-auto max-w-[800px] text-center mb-12">
            <h1 className="text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
              DSI News
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 px-4">
              Stay updated with the latest achievements, events, and news from the University of Florida Data Science and Informatics community.
            </p>
            <a className='button mt-3' href='https://discord.com/channels/972919518852698263/1418668711396643007/1437529973253607535'>Subscribe to the newsletter</a>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="pt-10 md:pt-8 pb-6 md:pb-8 bg-gray-100 dark:bg-black">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <FeaturedArticle
                  key={article.id}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="pt-6 md:pt-8 pb-12 md:pb-16 bg-gray-100 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              All Stories
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => setSelectedArticle(article)}
                isSelected={selectedArticle?.id === article.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal/Detail View */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Article Image */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={selectedArticle.articleImage || selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <CategoryBadge category={selectedArticle.category} />
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedArticle.date}
                  </time>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  {selectedArticle.title}
                  {selectedArticle.link && selectedArticle.link.length > 0 && (
                    <a
                      href={selectedArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline ml-2"
                      title="Read full article"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H19.5V12M19.5 6L10.5 15M4.5 12V18H10.5" />
                      </svg>
                    </a>
                  )}
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {selectedArticle.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 