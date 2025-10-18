'use client';

import React from 'react';

const CompaniesWorked = () => {
  const allCompanies = [
    'microsoft',
    'lockheed-martin', 
    'deloitte',
    'amazon',
    'fifth-third-bank',
    'bank-of-america',
    'pepsico',
    'jpmorgan-chase',
    'ups',
    'nvidia',
    'capital-one',
    'meta',
    'ibm',
    'american-express',
    'citi',
    'tiktok'
  ];

  const midPoint = Math.ceil(allCompanies.length / 2);
  const topRow = allCompanies.slice(0, midPoint);
  const bottomRow = allCompanies.slice(midPoint);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase">
            Where our members go to work
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our talented members have gained valuable experience at leading companies across various industries
          </p>
        </div>

        {/* Top Row - Slides Left */}
        <div className="slider-container mb-8 relative">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none"></div>
          <div className="slide-track slide-left">
            {[...topRow, ...topRow].map((company, index) => (
              <div key={`top-${index}`} className="slide">
                <img
                  src={`/images/companies-worked/${company}.png`}
                  alt={`${company.replace('-', ' ')} logo`}
                  className={`max-w-full max-h-full object-contain pointer-events-none brightness-0 opacity-80 dark:brightness-0 dark:invert dark:opacity-100 ${company === 'capital-one' ? 'capital-one-large' : ''} ${company === 'tiktok' ? 'tiktok-large' : ''} ${company === 'ibm' ? 'ibm-small' : ''} ${company === 'citi' ? 'citi-small' : ''} ${company === 'jpmorgan-chase' ? 'jpmorgan-large' : ''} ${company === 'lockheed-martin' ? 'lockheed-large' : ''} ${company === 'nvidia' ? 'nvidia-large' : ''}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Slides Right */}
        <div className="slider-container relative">
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none"></div>
          <div className="slide-track slide-right">
            {[...bottomRow, ...bottomRow].map((company, index) => (
              <div key={`bottom-${index}`} className="slide">
                <img
                  src={`/images/companies-worked/${company}.png`}
                  alt={`${company.replace('-', ' ')} logo`}
                  className={`max-w-full max-h-full object-contain pointer-events-none brightness-0 opacity-80 dark:brightness-0 dark:invert dark:opacity-100 ${company === 'capital-one' ? 'capital-one-large' : ''} ${company === 'tiktok' ? 'tiktok-large' : ''} ${company === 'ibm' ? 'ibm-small' : ''} ${company === 'citi' ? 'citi-small' : ''} ${company === 'jpmorgan-chase' ? 'jpmorgan-large' : ''} ${company === 'lockheed-martin' ? 'lockheed-large' : ''} ${company === 'nvidia' ? 'nvidia-large' : ''}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 100px;
        }

        .slide-track {
          display: flex;
          width: calc(260px * 16);
        }

        .slide-track.slide-left {
          animation: scroll-left 40s linear infinite;
        }

        .slide-track.slide-right {
          animation: scroll-right 40s linear infinite;
        }

        .slide {
          height: 60px;
          width: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin: 0 50px;
        }

        .capital-one-large {
          max-width: 120px !important;
          max-height: 60px !important;
        }

        .nvidia-large {
          max-width: 150px !important;
          max-height: 75px !important;
        }

        .tiktok-large {
          max-width: 250px !important;
          max-height: 125px !important;
        }

        .ibm-small {
          max-width: 85px !important;
          max-height: 42px !important;
        }

        .citi-small {
          max-width: 75px !important;
          max-height: 37px !important;
        }

        .jpmorgan-large {
          max-width: 200px !important;
          max-height: 100px !important;
        }

        .lockheed-large {
          max-width: 180px !important;
          max-height: 90px !important;
        }

        @keyframes scroll-left {
          from { 
            transform: translateX(0); 
          }
          to { 
            transform: translateX(calc(-260px * 8));
          }
        }

        @keyframes scroll-right {
          from { 
            transform: translateX(calc(-260px * 8));
          }
          to { 
            transform: translateX(0);
          }
        }

      `}</style>
    </section>
  );
};

export default CompaniesWorked;
