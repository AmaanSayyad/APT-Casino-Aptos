"use client";
import { useState, useEffect } from 'react';

// Mock data for Aptos testnet lending market
const MOCK_LENDING_DATA = {
  userDeposits: [
    {
      symbol: 'APT',
      name: 'Aptos Coin',
      amount: '25.5',
      apy: '8.2',
      iconColor: '#F1324D'
    },
    {
      symbol: 'APTC',
      name: 'APT Casino Token',
      amount: '500.0',
      apy: '12.5',
      iconColor: '#34C759'
    }
  ],
  userBorrows: [
    {
      symbol: 'APT',
      name: 'Aptos Coin',
      amount: '5.0',
      apy: '15.2',
      iconColor: '#F1324D'
    }
  ],
  marketRates: {
    APT: { apy: '8.2', ltv: '0.7' },
    APTC: { apy: '12.5', ltv: '0.6' }
  }
};

export const useLendingMarket = () => {
  const [userDeposits, setUserDeposits] = useState(MOCK_LENDING_DATA.userDeposits);
  const [userBorrows, setUserBorrows] = useState(MOCK_LENDING_DATA.userBorrows);
  const [marketRates, setMarketRates] = useState(MOCK_LENDING_DATA.marketRates);
  const [isLoading, setIsLoading] = useState(false);

  // Mock functions for Aptos testnet
  const depositAsset = async (asset, amount) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to deposits
      const newDeposit = {
        symbol: asset.symbol,
        name: asset.name,
        amount: amount.toString(),
        apy: asset.apy || '8.2',
        iconColor: asset.iconColor || '#F1324D'
      };
      
      setUserDeposits(prev => [...prev, newDeposit]);
      return { success: true, message: `Successfully deposited ${amount} ${asset.symbol}` };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawAsset = async (asset, amount) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from deposits
      setUserDeposits(prev => 
        prev.filter(deposit => 
          !(deposit.symbol === asset.symbol && parseFloat(deposit.amount) >= parseFloat(amount))
        )
      );
      
      return { success: true, message: `Successfully withdrawn ${amount} ${asset.symbol}` };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const borrowAsset = async (asset, amount) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to borrows
      const newBorrow = {
        symbol: asset.symbol,
        name: asset.name,
        amount: amount.toString(),
        apy: asset.apy || '15.2',
        iconColor: asset.iconColor || '#F1324D'
      };
      
      setUserBorrows(prev => [...prev, newBorrow]);
      return { success: true, message: `Successfully borrowed ${amount} ${asset.symbol}` };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const repayAsset = async (asset, amount) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from borrows
      setUserBorrows(prev => 
        prev.filter(borrow => 
          !(borrow.symbol === asset.symbol && parseFloat(borrow.amount) >= parseFloat(amount))
        )
      );
      
      return { success: true, message: `Successfully repaid ${amount} ${asset.symbol}` };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userDeposits,
    userBorrows,
    marketRates,
    isLoading,
    depositAsset,
    withdrawAsset,
    borrowAsset,
    repayAsset
  };
};

export default useLendingMarket; 