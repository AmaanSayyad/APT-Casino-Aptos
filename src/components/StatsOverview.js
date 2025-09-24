"use client";
import React from 'react';
import useTokenStats from '../hooks/useTokenStats';
import GradientBorderButton from './GradientBorderButton';

const StatsOverview = () => {
  const stats = useTokenStats();
  
  // Format number with commas
  const formatNumber = (num) => {
    if (num === null) return '----';
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Format price with $ sign and 2 decimal places
  const formatPrice = (price) => {
    if (price === null) return '$--.-';
    return `$${parseFloat(price).toFixed(2)}`;
  };
  
  // Format percentage
  const formatPercent = (percent) => {
    if (percent === null) return '--.-%';
    return `${percent}%`;
  };
  
  return (
    <div className="bg-[#1A0015] rounded-xl p-6 mb-10 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-magic to-blue-magic mr-2"></div>
            <h3 className="text-white/70 font-display text-sm uppercase tracking-wider">Platform Statistics</h3>
          </div>
          <p className="text-white/50 text-sm">Real-time overview of the APT Casino ecosystem</p>
        </div>
        
        <div className="flex flex-wrap gap-8 justify-center md:justify-end">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              {stats.loading ? (
                <div className="h-6 w-20 bg-white/10 animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-red-magic to-blue-magic">
                  {formatNumber(stats.totalAPTCPool)}
                </span>
              )}
            </div>
            <p className="text-xs uppercase mt-1 text-white/70">Total APTC Pool</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              {stats.loading ? (
                <div className="h-6 w-16 bg-white/10 animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-red-magic to-blue-magic">
                  {formatPercent(stats.aptcAPY)}
                </span>
              )}
            </div>
            <p className="text-xs uppercase mt-1 text-white/70">APTC APY</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              {stats.loading ? (
                <div className="h-6 w-16 bg-white/10 animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-red-magic to-blue-magic">
                  {formatPrice(stats.aptcPrice)}
                </span>
              )}
            </div>
            <p className="text-xs uppercase mt-1 text-white/70">APTC Price</p>
          </div>
          
          <div className="flex flex-col items-center">
            <GradientBorderButton>
              Lend Assets
            </GradientBorderButton>
          </div>
        </div>
      </div>
      
      {/* Additional stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#250020] rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">Market Cap</p>
          <p className="text-lg font-medium">
            {stats.loading ? (
              <div className="h-5 w-24 bg-white/10 animate-pulse rounded"></div>
            ) : (
              formatPrice(stats.marketCap)
            )}
          </p>
        </div>
        
        <div className="bg-[#250020] rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">24h Volume</p>
          <p className="text-lg font-medium">
            {stats.loading ? (
              <div className="h-5 w-24 bg-white/10 animate-pulse rounded"></div>
            ) : (
              formatPrice(stats.volume24h)
            )}
          </p>
        </div>
        
        <div className="bg-[#250020] rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">24h Change</p>
          <p className={`text-lg font-medium ${stats.priceChange24h && stats.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.loading ? (
              <div className="h-5 w-16 bg-white/10 animate-pulse rounded"></div>
            ) : (
              `${stats.priceChange24h > 0 ? '+' : ''}${stats.priceChange24h}%`
            )}
          </p>
        </div>
      </div>
      
      <div className="w-full h-0.5 magic-gradient rounded-full"></div>
      
      {/* Last updated timestamp */}
      {stats.lastUpdated && (
        <div className="mt-2 flex justify-end">
          <p className="text-xs text-white/30">
            Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsOverview; 