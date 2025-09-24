"use client";
import React, { useState, useEffect } from 'react';
import GradientBorderButton from './GradientBorderButton';
import GradientBgButton from './GradientBgButton';

const AssetRow = ({ asset, onDeposit, onWithdraw, depositData, isConnected }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  // Format percentage
  const formatPercent = (percent) => {
    return typeof percent === 'string' && percent.includes('%') 
      ? percent 
      : `${parseFloat(percent || 0).toFixed(2)}%`;
  };
  
  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      onDeposit(asset, depositAmount);
      setDepositAmount('');
      setIsDepositModalOpen(false);
    }
  };
  
  const handleWithdraw = () => {
    onWithdraw(asset, depositData?.amount || 0);
    setIsWithdrawModalOpen(false);
  };
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-5 px-4">
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white"
            style={{ backgroundColor: asset.iconColor }}
          >
            <span className="text-xs font-bold">{asset.symbol.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{asset.symbol}</p>
            <p className="text-xs text-white/50">{asset.name}</p>
          </div>
        </div>
      </td>
      <td className="py-5 px-4">
        <span className="font-medium">
          {formatPercent(asset.apy || asset.apr)}
        </span>
      </td>
      <td className="py-5 px-4">
        <span className="font-medium">
          {depositData ? depositData.amount : '0'}
        </span>
      </td>
      <td className="py-5 px-4">
        <div className="flex gap-2 justify-end">
          <GradientBorderButton 
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={!isConnected || !depositData || parseFloat(depositData?.amount || 0) <= 0}
          >
            Withdraw
          </GradientBorderButton>
          <GradientBgButton 
            onClick={() => setIsDepositModalOpen(true)}
            disabled={!isConnected}
          >
            Deposit
          </GradientBgButton>
        </div>
        
        {/* Deposit Modal */}
        {isDepositModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A0015] rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-medium mb-4">Deposit {asset.symbol}</h3>
              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-2">Amount to Deposit</label>
                <div className="p-[1px] rounded-md bg-gradient-to-r from-red-magic to-blue-magic">
                  <div className="flex bg-[#250020] rounded-md overflow-hidden">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-transparent flex-1 p-3 focus:outline-none text-white"
                    />
                    <button className="bg-[#1A0015] px-4 text-sm font-medium">MAX</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <GradientBorderButton onClick={() => setIsDepositModalOpen(false)}>
                  Cancel
                </GradientBorderButton>
                <GradientBgButton onClick={handleDeposit}>
                  Confirm
                </GradientBgButton>
              </div>
            </div>
          </div>
        )}
        
        {/* Withdraw Modal */}
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A0015] rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-medium mb-4">Withdraw {asset.symbol}</h3>
              <div className="mb-4">
                <p className="text-white/70 mb-2">
                  Available to withdraw: <span className="font-medium">{depositData?.amount || 0} {asset.symbol}</span>
                </p>
                <p className="text-sm text-white/50 mb-4">
                  Withdrawing will reduce your position and stop earning APY on this amount.
                </p>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <GradientBorderButton onClick={() => setIsWithdrawModalOpen(false)}>
                  Cancel
                </GradientBorderButton>
                <GradientBgButton onClick={handleWithdraw}>
                  Withdraw All
                </GradientBgButton>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

const LendingTable = ({ assets = [], isLoading = false }) => {
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userDeposits, setUserDeposits] = useState({});
  const [isPending, setIsPending] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';
  
  useEffect(() => {
    setIsClient(true);
    
    // In development mode, mock connected state and deposits
    if (isDev) {
      setIsConnected(true);
      // Create mock deposits for demo assets
      const mockDeposits = {};
      assets.forEach(asset => {
        mockDeposits[asset.symbol] = {
          amount: (Math.random() * 100).toFixed(2),
          value: (Math.random() * 1000).toFixed(2)
        };
      });
      setUserDeposits(mockDeposits);
      return;
    }
    
    // Load connection state for Aptos
    const loadConnectionState = async () => {
      try {
        // Set connected state for Aptos testnet
        setIsConnected(true);
        
        // Try to load user deposits
        try {
          const { default: useLendingMarket } = await import('../hooks/useLendingMarket');
          const { userDeposits } = useLendingMarket();
          if (userDeposits) {
            setUserDeposits(userDeposits);
          }
        } catch (err) {
          console.warn("Failed to load user deposits:", err);
        }
      } catch (err) {
        console.warn("Failed to load wallet connection state:", err);
      }
    };
    
    loadConnectionState();
  }, [isDev, assets]);
  
  const handleDeposit = async (asset, amount) => {
    if (!isConnected) {
      // Show Aptos wallet connection message
      if (!isDev) {
        alert("Please connect your Aptos wallet to continue");
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      // In development mode, just simulate a deposit
      if (isDev) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        
        // Update the mock deposit
        setUserDeposits(prev => ({
          ...prev,
          [asset.symbol]: {
            amount: parseFloat(prev[asset.symbol]?.amount || 0) + parseFloat(amount),
            value: parseFloat(prev[asset.symbol]?.value || 0) + parseFloat(amount) * 10
          }
        }));
        
        alert(`Successfully deposited ${amount} ${asset.symbol}`);
      } else {
        // In production, use the actual deposit function
        try {
          const { default: useLendingMarket } = await import('../hooks/useLendingMarket');
          const { depositAsset } = useLendingMarket();
          await depositAsset(asset, amount);
          alert(`Successfully deposited ${amount} ${asset.symbol}`);
        } catch (err) {
          console.error('Deposit failed:', err);
          alert(`Deposit failed: ${err.message}`);
        }
      }
    } finally {
      setIsPending(false);
    }
  };
  
  const handleWithdraw = async (asset, amount) => {
    if (!isConnected) {
      // Show Aptos wallet connection message
      if (!isDev) {
        alert("Please connect your Aptos wallet to continue");
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      // In development mode, just simulate a withdrawal
      if (isDev) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        
        // Update the mock deposit
        setUserDeposits(prev => ({
          ...prev,
          [asset.symbol]: {
            amount: 0,
            value: 0
          }
        }));
        
        alert(`Successfully withdrawn ${amount} ${asset.symbol}`);
      } else {
        // In production, use the actual withdraw function
        try {
          const { default: useLendingMarket } = await import('../hooks/useLendingMarket');
          const { withdrawAsset } = useLendingMarket();
          await withdrawAsset(asset, amount);
          alert(`Successfully withdrawn ${amount} ${asset.symbol}`);
        } catch (err) {
          console.error('Withdrawal failed:', err);
          alert(`Withdrawal failed: ${err.message}`);
        }
      }
    } finally {
      setIsPending(false);
    }
  };
  
  // Loading state
  if (isLoading || !isClient) {
    return (
      <div className="bg-gradient-to-r p-[1px] from-red-magic to-blue-magic rounded-xl overflow-hidden">
        <div className="bg-[#1A0015] rounded-xl p-6 overflow-x-auto">
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-white/20 rounded-full border-t-[#E04C95]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-r p-[1px] from-red-magic to-blue-magic rounded-xl overflow-hidden">
      <div className="bg-[#1A0015] rounded-xl p-4 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-4 font-display text-sm text-white/70">ASSET</th>
              <th className="text-left py-4 px-4 font-display text-sm text-white/70">APY</th>
              <th className="text-left py-4 px-4 font-display text-sm text-white/70">YOUR DEPOSIT</th>
              <th className="text-right py-4 px-4 font-display text-sm text-white/70">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <AssetRow 
                key={index} 
                asset={asset} 
                onDeposit={handleDeposit} 
                onWithdraw={handleWithdraw}
                depositData={userDeposits[asset.symbol]}
                isConnected={isConnected}
              />
            ))}
            
            {/* Empty state */}
            {assets.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/50">
                  No assets available for the current network
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Connection prompt */}
        {!isConnected && !isDev && (
          <div className="mt-4 p-4 bg-[#250020] rounded-lg">
            <p className="text-center text-white/70 mb-2">Connect your wallet to see your deposits and start earning</p>
            <div className="flex justify-center">
              <GradientBgButton onClick={() => {
                // Show Aptos wallet connection message
                alert("Please connect your Aptos wallet to continue");
              }}>
                Connect Aptos Wallet
              </GradientBgButton>
            </div>
          </div>
        )}
        
        {isDev && (
          <div className="mt-4 p-4 bg-[#250020] rounded-lg border border-yellow-600/30">
            <p className="text-center text-white/70">
              <span className="bg-yellow-600/80 text-white text-xs px-2 py-1 rounded-md mr-2">
                Dev Mode
              </span>
              Using simulated assets and deposits for development
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LendingTable; 