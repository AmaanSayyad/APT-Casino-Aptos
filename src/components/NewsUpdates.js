'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NewsUpdates = () => {
  const newsItems = [
    {
      id: 1,
      title: 'New Token Bridge Partnership with Aptos',
      excerpt: 'APT Casino partners with Aptos Network to provide seamless cross-chain token transfers with lower fees.',
      date: '2025-05-08',
      category: 'Partnership',
      image: '/images/news/partnership.png',
      url: '/news/token-bridge-partnership'
    },
    {
      id: 2,
      title: 'APTC Governance Proposal: Community Jackpots',
      excerpt: 'Vote on the new proposal to allocate 5% of platform fees to community-controlled jackpot pools.',
      date: '2025-05-04',
      category: 'Governance',
      image: '/images/news/governance.png',
      url: '/news/community-jackpots'
    },
    {
      id: 3,
      title: 'New Games Added: Crash and Plinko',
      excerpt: 'Two new provably fair games have been added to our collection with exclusive launch bonuses.',
      date: '2025-05-03',
      category: 'Platform',
      image: '/images/news/new-games.png',
      url: '/news/new-games-crash-plinko'
    },
    {
      id: 4,
      title: 'Security Audit Completed by Certik',
      excerpt: 'APT Casino\'s smart contracts have passed rigorous security auditing by Certik with high scores.',
      date: '2025-05-02',
      category: 'Security',
      image: '/images/news/security.png',
      url: '/news/certik-audit'
    }
  ];
  
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Platform', 'Governance', 'Partnership', 'Security'];
  
  const filteredNews = activeCategory === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="w-1 h-6 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">Latest Updates</h2>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-red-magic to-blue-magic text-white'
                  : 'bg-[#250020] text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNews.map((item) => (
            <Link href={item.url} key={item.id}>
              <div className="p-[1px] bg-gradient-to-r from-red-magic/80 to-blue-magic/80 rounded-xl h-full cursor-pointer hover:from-red-magic hover:to-blue-magic transition-all">
                <div className="bg-[#1A0015] rounded-xl h-full overflow-hidden">
                  {/* News Image */}
                  <div className="h-40 relative">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 bg-red-magic text-white text-xs py-1 px-2 rounded-tr-md">
                      {item.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-white/50 text-xs mb-2">{formatDate(item.date)}</p>
                    <h3 className="text-white font-medium text-lg mb-2">{item.title}</h3>
                    <p className="text-white/70 text-sm">{item.excerpt}</p>
                    
                    <div className="mt-4 flex items-center text-red-magic hover:text-blue-magic transition-colors">
                      <span className="text-sm font-medium">Read More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All News Link */}
        <div className="mt-10 text-center">
          <Link href="/news">
            <div className="inline-block">
              <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-md inline-block">
                <button className="bg-[#1A0015] hover:bg-[#250020] transition-colors text-white font-display px-8 py-3 rounded-md flex items-center">
                  View All News
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates; 