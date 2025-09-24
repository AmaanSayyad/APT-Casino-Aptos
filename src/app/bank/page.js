"use client";
import React, { useState, useEffect, useCallback } from 'react';
import HeaderText from "@/components/HeaderText";
import StatsOverview from "@/components/StatsOverview";

import BorrowCard from "@/components/BorrowCard";
import LendingTable from "@/components/LendingTable";
import Image from "next/image";
import { FaChartLine, FaHistory, FaInfoCircle, FaExchangeAlt, FaCoins, FaWallet, FaLock, FaUnlock } from "react-icons/fa";

  // Assets for borrowing on Aptos testnet only
const BORROW_ASSETS = {
  aptos_testnet: [
    {
      symbol: "APT",
      name: "Aptos Coin",
      iconColor: "#F1324D",
      address: null // Native token
    }
  ]
};

// Mock transaction history
const MOCK_TRANSACTIONS = [
  { type: 'deposit', token: 'APTC', amount: '120.5', date: new Date(Date.now() - 86400000 * 2), status: 'completed' },
  { type: 'borrow', token: 'MNT', amount: '0.3', date: new Date(Date.now() - 86400000), status: 'completed' },
  { type: 'swap', tokenFrom: 'MNT', tokenTo: 'APTC', amountFrom: '0.2', amountTo: '98.32', date: new Date(), status: 'completed' }
];

export default function Bank() {
  const [chainId, setChainId] = useState('aptos_testnet'); // Default to Aptos testnet
  const [assets, setAssets] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('swap');
  const [transactions, setTransactions] = useState([]);
  const [showNetworkBanner, setShowNetworkBanner] = useState(true);
  const [marketTrends, setMarketTrends] = useState({
    aptcPrice: 2.83,
    aptc24hChange: 12.5,
    marketCap: 18500000,
    totalLocked: 3200000
  });
  const isDev = process.env.NODE_ENV === 'development';
  
  // Format currency with dollar sign
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }, []);
  
  // Format large numbers with commas
  const formatNumber = useCallback((value) => {
    return new Intl.NumberFormat('en-US').format(value);
  }, []);
  
  useEffect(() => {
    setIsClient(true);
    
    // In development mode, use mock data
    if (isDev) {
      setChainId('aptos_testnet'); // Aptos testnet for development
      setAssets([
        {
          symbol: "APT",
          name: "Aptos Coin",
          iconColor: "#F1324D",
          address: "0x...",
          apr: "12.5%",
          totalDeposited: "$240,000",
          available: "$120,000"
        },
        {
          symbol: "APTC",
          name: "APT Casino Token",
          iconColor: "#34C759",
          address: "0x...",
          apr: "8.2%",
          totalDeposited: "$520,000",
          available: "$320,000"
        },
        {
          symbol: "APT",
          name: "Aptos",
          iconColor: "#2196F3",
          address: null,
          apr: "4.8%",
          totalDeposited: "$180,000",
          available: "$95,000"
        }
      ]);
      
      // Set mock transactions
      setTransactions(MOCK_TRANSACTIONS);
      
      setIsLoading(false);
      return;
    }
    
    // Load Aptos testnet data
    const loadChainData = async () => {
      try {
        // Set to Aptos testnet
        setChainId('aptos_testnet');
        
        // Set mock lending market data for Aptos testnet
        setAssets([
          {
            symbol: "APT",
            name: "Aptos Coin",
            iconColor: "#F1324D",
            address: "0x...",
            apr: "12.5%",
            totalDeposited: "$240,000",
            available: "$120,000"
          },
          {
            symbol: "APTC",
            name: "APT Casino Token",
            iconColor: "#34C759",
            address: "0x...",
            apr: "8.2%",
            totalDeposited: "$520,000",
            available: "$320,000"
          }
        ]);
        
        // Load transaction history
        setTransactions(MOCK_TRANSACTIONS);
        
        setIsLoading(false);
      } catch (err) {
        console.warn("Failed to load chain data:", err);
        setIsLoading(false);
      }
    };
    
    loadChainData();
  }, [isDev]);
  
  // Get appropriate borrow assets for Aptos testnet
  const borrowAssets = BORROW_ASSETS.aptos_testnet;
  
  // Animated number component for stats
  const AnimatedNumber = ({ value, prefix = '', suffix = '', duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      let startValue = 0;
      const endValue = parseFloat(value);
      const startTime = Date.now();
      
      const updateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed >= duration) {
          setDisplayValue(endValue);
          return;
        }
        
        const progress = elapsed / duration;
        const currentValue = startValue + progress * (endValue - startValue);
        setDisplayValue(currentValue);
        requestAnimationFrame(updateValue);
      };
      
      requestAnimationFrame(updateValue);
      
      return () => {
        startValue = displayValue;
      };
    }, [value, duration]);
    
    return (
      <span>
        {prefix}{typeof displayValue === 'number' ? displayValue.toFixed(2) : displayValue}{suffix}
      </span>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sharp-black to-[#150012] text-white">
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
        {/* Network banner moved inside the container and positioned after the navbar */}
        {showNetworkBanner && (
          <div className="bg-gradient-to-r from-red-magic/80 to-blue-magic/80 py-2 px-4 text-center relative mb-8 rounded-lg">
            <p className="text-white text-sm">
              Connected to Aptos Testnet. 
              <button className="underline ml-2">Switch Network</button>
            </p>
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={() => setShowNetworkBanner(false)}
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="mb-10 text-center">
          <HeaderText
            header="APT Casino Bank" 
            description="Manage your assets, deposit collateral, and borrow tokens to play your favorite casino games"
          />
        </div>
        
        {/* Main Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar">
            <button 
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'swap' ? 'text-white border-b-2 border-blue-magic' : 'text-white/50 hover:text-white/80'}`}
              onClick={() => setActiveTab('swap')}
            >
              <FaExchangeAlt /> Swap
            </button>
            <button 
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'borrow' ? 'text-white border-b-2 border-blue-magic' : 'text-white/50 hover:text-white/80'}`}
              onClick={() => setActiveTab('borrow')}
            >
              <FaUnlock /> Borrow
            </button>
            <button 
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'lend' ? 'text-white border-b-2 border-blue-magic' : 'text-white/50 hover:text-white/80'}`}
              onClick={() => setActiveTab('lend')}
            >
              <FaLock /> Lend
            </button>
            <button 
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'text-white border-b-2 border-blue-magic' : 'text-white/50 hover:text-white/80'}`}
              onClick={() => setActiveTab('history')}
            >
              <FaHistory /> History
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'swap' && (
            <>
              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-gradient-to-r p-[1px] from-red-magic to-blue-magic rounded-xl">
                  {/* Aptos Testnet Only - No Uniswap Integration */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Aptos Testnet Only</h3>
          <p className="text-gray-400">This application works exclusively with Aptos testnet</p>
        </div>
                </div>
              </div>
              
              {/* Market Trends - Only shown in swap tab */}
              <div className="mb-12 p-[1px] bg-gradient-to-r from-red-magic/50 to-blue-magic/50 rounded-xl">
                <div className="bg-[#1A0015] rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <FaChartLine className="text-blue-magic mr-2" />
                    <h2 className="text-xl font-display font-medium">Market Trends</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#250020] p-4 rounded-lg hover:bg-[#350030] transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">APTC Price</span>
                        <div className="flex items-center">
                          <div className="h-2 w-16 bg-[#120010] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-magic to-blue-magic"
                              style={{ width: `${Math.min(Math.abs(marketTrends.aptc24hChange), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold">
                          <AnimatedNumber value={marketTrends.aptcPrice} prefix="$" />
                        </span>
                        <span className={`ml-2 text-sm ${marketTrends.aptc24hChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {marketTrends.aptc24hChange >= 0 ? '↑' : '↓'} {Math.abs(marketTrends.aptc24hChange)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-[#250020] p-4 rounded-lg hover:bg-[#350030] transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Market Cap</span>
                        <FaInfoCircle className="text-white/40 hover:text-white/70 transition-colors cursor-help" />
                      </div>
                      <div className="text-2xl font-bold">
                        <AnimatedNumber value={marketTrends.marketCap / 1000000} suffix="M" prefix="$" />
                      </div>
                    </div>
                    
                    <div className="bg-[#250020] p-4 rounded-lg hover:bg-[#350030] transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Total Value Locked</span>
                        <FaInfoCircle className="text-white/40 hover:text-white/70 transition-colors cursor-help" />
                      </div>
                      <div className="text-2xl font-bold">
                        <AnimatedNumber value={marketTrends.totalLocked / 1000000} suffix="M" prefix="$" />
                      </div>
                    </div>
                    
                    <div className="bg-[#250020] p-4 rounded-lg hover:bg-[#350030] transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">APY Range</span>
                        <FaInfoCircle className="text-white/40 hover:text-white/70 transition-colors cursor-help" />
                      </div>
                      <div className="text-2xl font-bold">4.8% - 12.5%</div>
                      <div className="text-white/60 text-xs mt-1">Updated 5 min ago</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Overview - Only shown in swap tab */}
              <div className="mb-12">
                <StatsOverview />
              </div>
            </>
          )}
          
          {activeTab === 'borrow' && (
            <div>
              <p className="text-white/70 mb-6">Borrow tokens with your deposited collateral. Maintain a healthy collateral ratio to avoid liquidation.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {borrowAssets.map((asset, index) => (
                  <BorrowCard key={index} asset={asset} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'lend' && (
            <div>
              <p className="text-white/70 mb-6">Deposit collateral to earn interest and unlock borrowing power. The more you deposit, the more you can borrow.</p>
              <LendingTable assets={assets} isLoading={isLoading} />
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <p className="text-white/70 mb-6">Your transaction history in the APT Casino Bank. All transactions are recorded on the blockchain for transparency.</p>
              
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-white/70 font-medium">Type</th>
                        <th className="py-3 px-4 text-white/70 font-medium">Details</th>
                        <th className="py-3 px-4 text-white/70 font-medium">Date</th>
                        <th className="py-3 px-4 text-white/70 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {tx.type === 'deposit' && <FaWallet className="text-green-500" />}
                              {tx.type === 'borrow' && <FaUnlock className="text-yellow-500" />}
                              {tx.type === 'swap' && <FaExchangeAlt className="text-blue-magic" />}
                              <span className="capitalize">{tx.type}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {tx.type === 'swap' ? (
                              <span>{tx.amountFrom} {tx.tokenFrom} → {tx.amountTo} {tx.tokenTo}</span>
                            ) : (
                              <span>{tx.amount} {tx.token}</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {tx.date.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500 capitalize">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-[#1A0015] rounded-xl">
                  <FaHistory className="mx-auto text-4xl text-white/30 mb-4" />
                  <h3 className="text-xl mb-2">No transactions yet</h3>
                  <p className="text-white/50">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-[1px] bg-gradient-to-r from-red-magic/30 to-blue-magic/30 rounded-xl hover:from-red-magic hover:to-blue-magic transition-all duration-300">
            <div className="bg-[#1A0015] rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#250020] flex items-center justify-center mr-3">
                  <FaCoins className="text-yellow-500" />
                </div>
                <h3 className="text-lg font-medium">Earn Interest</h3>
              </div>
              <p className="text-white/70 mb-4">
                Deposit your tokens to earn competitive interest rates. APT Casino Bank offers some of the highest APYs in DeFi.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex justify-between">
                  <span className="text-white/60">APTC</span>
                  <span className="text-green-500">12.5% APY</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">USDC</span>
                  <span className="text-green-500">8.2% APY</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">MNT</span>
                  <span className="text-green-500">4.8% APY</span>
                </li>
              </ul>
              <button 
                onClick={() => setActiveTab('lend')}
                className="text-sm bg-[#250020] hover:bg-[#350030] transition-colors py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <FaLock /> Deposit Now
              </button>
            </div>
          </div>
          
          <div className="p-[1px] bg-gradient-to-r from-red-magic/30 to-blue-magic/30 rounded-xl hover:from-red-magic hover:to-blue-magic transition-all duration-300">
            <div className="bg-[#1A0015] rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#250020] flex items-center justify-center mr-3">
                  <FaWallet className="text-blue-magic" />
                </div>
                <h3 className="text-lg font-medium">How It Works</h3>
              </div>
              <ol className="space-y-4 mb-6">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#250020] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Deposit Collateral</h4>
                    <p className="text-white/60 text-sm">Deposit supported tokens as collateral to earn interest.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#250020] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Borrow Tokens</h4>
                    <p className="text-white/60 text-sm">Borrow up to 70% of your collateral value in other tokens.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#250020] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Play & Win</h4>
                    <p className="text-white/60 text-sm">Use borrowed tokens to play games and win big.</p>
                  </div>
                </li>
              </ol>
              <div className="text-center">
                <button className="bg-gradient-to-r from-red-magic to-blue-magic hover:from-blue-magic hover:to-red-magic transition-all text-white px-4 py-2 rounded-lg font-medium text-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
