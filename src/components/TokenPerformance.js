'use client';
import { useState, useEffect } from 'react';
import GradientBorderButton from '@/components/GradientBorderButton';
import Link from 'next/link';

const TokenPerformance = () => {
  // Mock data for token performance
  const [tokenData, setTokenData] = useState({
    price: 1.24,
    priceChange24h: 5.82,
    marketCap: 18450000,
    volume24h: 3820000,
    circulatingSupply: 14800000,
    maxSupply: 50000000,
    chart: null,
  });
  
  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      const priceChange = (Math.random() * 0.04) - 0.02; // Random between -0.02 and 0.02
      setTokenData(prev => ({
        ...prev,
        price: parseFloat((prev.price + priceChange).toFixed(2)),
        priceChange24h: parseFloat((prev.priceChange24h + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        volume24h: prev.volume24h + Math.floor(Math.random() * 10000 - 5000),
      }));
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate points for a simple "chart"
  const generateChartPoints = () => {
    const values = [];
    for (let i = 0; i < 20; i++) {
      values.push(1 + Math.random() * 0.5);
    }
    return values;
  };
  
  // Format large numbers with K, M, B
  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num;
  };
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 relative">
      {/* Background accent */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-red-magic/5 blur-[120px] z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <div className="w-1 h-6 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">APTC Token Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Chart Section */}
          <div className="md:col-span-8 p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl">
            <div className="bg-[#1A0015] rounded-xl p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-magic to-blue-magic flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <h3 className="text-white text-xl font-medium">APTC</h3>
                    <span className={`ml-3 px-2 py-1 rounded text-xs ${
                      tokenData.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h}%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">${tokenData.price}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-[#250020] hover:bg-[#300030] text-white/70 px-3 py-1 rounded-md text-sm">
                    24H
                  </button>
                  <button className="bg-[#250020] hover:bg-[#300030] text-white/70 px-3 py-1 rounded-md text-sm">
                    7D
                  </button>
                  <button className="bg-[#250020] hover:bg-[#300030] text-white/70 px-3 py-1 rounded-md text-sm">
                    30D
                  </button>
                </div>
              </div>
              
              {/* Simplified Chart - In a real app you would use a proper chart library */}
              <div className="h-48 w-full relative">
                <div className="absolute inset-0 flex items-end">
                  {generateChartPoints().map((point, index) => (
                    <div 
                      key={index} 
                      className="flex-1 h-full flex items-end"
                    >
                      <div 
                        className={`w-full ${index % 2 === 0 ? 'bg-red-magic/40' : 'bg-blue-magic/40'}`}
                        style={{ height: `${point * 30}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0015] to-transparent opacity-40"></div>
              </div>
            </div>
          </div>
          
          {/* Stats and CTA */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="p-[1px] bg-gradient-to-r from-red-magic/40 to-blue-magic/40 rounded-xl">
              <div className="bg-[#1A0015] rounded-xl p-6">
                <h3 className="text-white/70 text-sm mb-4">Token Metrics</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Market Cap</span>
                    <span className="text-white font-medium">${formatNumber(tokenData.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">24h Volume</span>
                    <span className="text-white font-medium">${formatNumber(tokenData.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Circulating Supply</span>
                    <span className="text-white font-medium">{formatNumber(tokenData.circulatingSupply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Max Supply</span>
                    <span className="text-white font-medium">{formatNumber(tokenData.maxSupply)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl">
              <div className="bg-[#1A0015] rounded-xl p-6">
                <h3 className="text-white text-lg font-medium mb-2">Ready to invest in APTC?</h3>
                <p className="text-white/70 text-sm mb-4">
                  Stake APTC to earn passive income while playing your favorite games.
                </p>
                <Link href="/bank">
                  <div className="block w-full">
                    <button className="w-full magic-gradient hover:opacity-90 transition-opacity text-white font-display py-3 px-6 rounded-md">
                      Go to Bank
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenPerformance; 