'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GradientBorderButton from './GradientBorderButton';

const UpcomingTournaments = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: 'Weekly Poker Championship',
      game: 'Poker',
      prizePool: 25000,
      entryFee: 50,
      startsIn: 172800, // 48 hours in seconds
      participants: 68,
      maxParticipants: 100,
      image: '/images/games/poker.png'
    },
    {
      id: 2,
      name: 'Fortune Tiger Tournament',
      game: 'Fortune Tiger',
      prizePool: 15000,
      entryFee: 25,
      startsIn: 86400, // 24 hours in seconds
      participants: 112,
      maxParticipants: 200,
      image: '/images/games/fortune-tiger.png'
    },
    {
      id: 3,
      name: 'Ultimate Roulette Challenge',
      game: 'Roulette',
      prizePool: 10000,
      entryFee: 15,
      startsIn: 43200, // 12 hours in seconds
      participants: 87,
      maxParticipants: 150,
      image: '/images/games/roulette.png'
    }
  ]);
  
  // Update countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setTournaments(prev => 
        prev.map(tournament => ({
          ...tournament,
          startsIn: Math.max(0, tournament.startsIn - 1)
        }))
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return 'Started';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mr-3"></div>
            <h2 className="text-2xl font-display font-bold text-white">Upcoming Tournaments</h2>
          </div>
          
          <Link href="/tournaments">
            <span className="text-white/70 hover:text-white text-sm flex items-center cursor-pointer">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl">
              <div className="bg-[#1A0015] rounded-xl h-full">
                <div className="p-4 relative h-32 overflow-hidden rounded-t-xl">
                  {/* This would be replaced with actual images in production */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#250020] to-[#1A0015]"></div>
                  
                  {/* Tournament name and game banner */}
                  <div className="relative z-10">
                    <span className="inline-block bg-red-magic/80 text-white text-xs py-1 px-2 rounded">
                      {tournament.game}
                    </span>
                    <h3 className="text-white text-xl font-medium mt-2">{tournament.name}</h3>
                  </div>
                </div>
                
                <div className="p-4 border-t border-white/5">
                  {/* Tournament details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-white/50 text-xs">Prize Pool</p>
                      <p className="text-white font-bold">${tournament.prizePool.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Entry Fee</p>
                      <p className="text-white font-bold">{tournament.entryFee} APTC</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Participants</p>
                      <p className="text-white font-bold">
                        {tournament.participants}/{tournament.maxParticipants}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Starts In</p>
                      <p className="text-white font-bold">
                        {formatTimeRemaining(tournament.startsIn)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="w-full h-2 bg-[#250020] rounded-full overflow-hidden">
                      <div 
                        className="h-full magic-gradient"
                        style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/50 mt-1 text-right">
                      {Math.round((tournament.participants / tournament.maxParticipants) * 100)}% Full
                    </p>
                  </div>
                  
                  {/* Register button */}
                  <GradientBorderButton classes="w-full">
                    <div className="w-full text-center">Register Now</div>
                  </GradientBorderButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingTournaments; 