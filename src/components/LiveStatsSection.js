'use client';
import { useState, useEffect } from 'react';
import { FaUsers, FaTrophy, FaCoins } from 'react-icons/fa';

const LiveStatsSection = () => {
  // Simulated stats data with initial values
  const [stats, setStats] = useState({
    activePlayers: 2458,
    totalJackpot: 158420,
    dailyWinners: 342,
    recentWinners: [
      { id: 1, name: 'CryptoWhale', amount: 12450, game: 'Poker', timeAgo: '2m ago' },
      { id: 2, name: '0x7a...e3f4', amount: 8560, game: 'Roulette', timeAgo: '5m ago' },
      { id: 3, name: 'BlockMaster', amount: 5280, game: 'Fortune Tiger', timeAgo: '12m ago' },
      { id: 4, name: '0x3d...8a7c', amount: 3695, game: 'Mines', timeAgo: '18m ago' },
    ]
  });

  // Simulate updating stats every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        activePlayers: prevStats.activePlayers + Math.floor(Math.random() * 5) - 2,
        totalJackpot: prevStats.totalJackpot + Math.floor(Math.random() * 200),
        dailyWinners: prevStats.dailyWinners + Math.floor(Math.random() * 2),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl">
          <div className="bg-[#120010] rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-[#1A0015] rounded-lg p-5 flex items-center space-x-4 border border-white/5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-magic/30 to-blue-magic/30">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white/70 text-sm">Active Players</h3>
                    <p className="text-white text-2xl font-bold">
                      {stats.activePlayers.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#1A0015] rounded-lg p-5 flex items-center space-x-4 border border-white/5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-magic/30 to-blue-magic/30">
                    <FaCoins className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white/70 text-sm">Total Jackpot</h3>
                    <p className="text-white text-2xl font-bold">
                      ${stats.totalJackpot.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#1A0015] rounded-lg p-5 flex items-center space-x-4 border border-white/5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-magic/30 to-blue-magic/30">
                    <FaTrophy className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white/70 text-sm">Daily Winners</h3>
                    <p className="text-white text-2xl font-bold">
                      {stats.dailyWinners.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Winners */}
            <div className="mt-8">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
                Recent Big Winners
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.recentWinners.map(winner => (
                  <div 
                    key={winner.id} 
                    className="p-[1px] bg-gradient-to-r from-red-magic/40 to-blue-magic/40 rounded-lg"
                  >
                    <div className="bg-[#1A0015] rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-white font-medium truncate">{winner.name}</p>
                        <span className="text-xs text-white/50">{winner.timeAgo}</span>
                      </div>
                      <p className="text-sm text-white/70 mb-1">Game: {winner.game}</p>
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-magic to-blue-magic">
                        ${winner.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStatsSection; 