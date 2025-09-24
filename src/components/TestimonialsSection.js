'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Michael T.',
      avatar: '/images/avatars/avatar1.png',
      rating: 5,
              text: 'APT Casino offers the most transparent gaming experience I\'ve found on Aptos. The provably fair system gives me confidence that games are legitimate, and I\'ve already won over 500 APT tokens!',
      game: 'Roulette',
      amount: 520
    },
    {
      id: 2,
      name: '0x63...a94b',
      avatar: '/images/avatars/avatar2.png',
      rating: 4,
      text: 'I love the token staking feature. Being able to earn passive income while also playing games creates a unique dual-earning opportunity that other platforms don\'t offer.',
      game: 'Poker',
      amount: 1240
    },
    {
      id: 3,
      name: 'CryptoQueen',
      avatar: '/images/avatars/avatar3.png',
      rating: 5,
      text: 'The DeFi lending integration is brilliant. I was able to use my collateral to borrow APT for games, and when I won big, I paid back the loan and kept the profits. Smart financial gaming!',
      game: 'Fortune Tiger',
      amount: 876
    },
    {
      id: 4,
      name: 'BlockchainGamer',
      avatar: '/images/avatars/avatar4.png',
      rating: 4,
      text: 'Weekly tournaments are extremely fun and well organized. The prize pools are generous, and the community is friendly and competitive in a good way.',
      game: 'Dice',
      amount: 340
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-20 left-1/4 w-64 h-64 rounded-full bg-red-magic/5 blur-[100px] z-0"></div>
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-blue-magic/5 blur-[100px] z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-12 justify-center">
          <div className="w-1 h-6 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">What Our Players Say</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Featured Testimonial */}
          <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl">
            <div className="bg-[#1A0015] rounded-xl p-6 md:p-8 h-full relative">
              <FaQuoteLeft className="text-red-magic/20 text-6xl absolute top-4 right-4" />
              
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    {/* Avatar placeholder - in a real app, use actual images */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-magic/40 to-blue-magic/40 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{testimonials[activeIndex].name.charAt(0)}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium">{testimonials[activeIndex].name}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-gray-600'} h-4 w-4`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/80 italic text-lg">
                    "{testimonials[activeIndex].text}"
                  </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-white/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white/50 text-sm">Favorite Game</p>
                      <p className="text-white">{testimonials[activeIndex].game}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Biggest Win</p>
                      <p className="text-white font-bold">{testimonials[activeIndex].amount} APT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial Navigation */}
          <div className="flex flex-col">
            <div className="text-center md:text-left mb-6">
              <h3 className="text-white text-lg font-medium">Success Stories</h3>
              <p className="text-white/60">
                Our players are winning big and enjoying the transparent gameplay that only a fully on-chain casino can provide.
              </p>
            </div>
            
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    activeIndex === index 
                      ? 'bg-gradient-to-r from-red-magic/20 to-blue-magic/20 border-l-2 border-red-magic' 
                      : 'hover:bg-[#250020]/30'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex items-center">
                    {/* Small avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-[#250020] flex items-center justify-center mr-3">
                      <span className="text-white text-sm">{testimonial.name.charAt(0)}</span>
                    </div>
                    
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'} h-3 w-3`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <span className="ml-auto text-white/60 text-sm">
                      {testimonial.amount} APT
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Dots for mobile navigation */}
        <div className="flex justify-center mt-6 md:hidden">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 mx-1 rounded-full ${
                activeIndex === index ? 'bg-red-magic' : 'bg-white/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 