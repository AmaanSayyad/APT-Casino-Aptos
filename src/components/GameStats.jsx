import React from 'react';
import { FaDice, FaCoins, FaTrophy } from 'react-icons/fa';

const GameStats = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-end gap-6 md:gap-8 text-white bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/5 shadow-lg">
      <div className="flex flex-col items-center md:items-end">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <FaDice className="text-blue-400" />
          <span className="uppercase tracking-wider font-display">Total Bets</span>
        </div>
        <p className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">956,421</p>
      </div>
      
      <div className="flex flex-col items-center md:items-end">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <FaCoins className="text-yellow-400" />
          <span className="uppercase tracking-wider font-display">Volume</span>
        </div>
        <p className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">4.7M APTC</p>
      </div>
      
      <div className="flex flex-col items-center md:items-end">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <FaTrophy className="text-green-400" />
          <span className="uppercase tracking-wider font-display">Max Win</span>
        </div>
        <p className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent">121,750 APTC</p>
      </div>
    </div>
  );
};

export default GameStats; 