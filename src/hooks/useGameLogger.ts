import { useState } from 'react';
import { toast } from 'react-toastify';

interface LogGameParams {
  gameType: 'plinko' | 'mines' | 'roulette' | 'wheel';
  playerAddress: string;
  betAmount: number;
  result: string;
  payout: number;
}

interface GameHistoryEntry {
  game_id: number;
  game_type: number;
  player_address: string;
  bet_amount: number;
  result: string;
  payout: number;
  timestamp: number;
  random_seed: number;
}

export const useGameLogger = () => {
  const [isLogging, setIsLogging] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const logGame = async (params: LogGameParams): Promise<{ success: boolean; transactionHash?: string; explorerUrl?: string; error?: string }> => {
    setIsLogging(true);
    try {
      const response = await fetch('/api/log-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success) {
        console.log('🎯 GAME SUCCESSFULLY LOGGED:');
        console.log('├── Transaction Hash:', data.transactionHash);
        console.log('├── Explorer URL:', data.explorerUrl);
        console.log('├── Game Type:', params.gameType);
        console.log('├── Player:', params.playerAddress);
        console.log('├── Bet Amount:', params.betAmount, 'APT');
        console.log('├── Result:', params.result);
        console.log('└── Payout:', params.payout, 'APT');
        return { success: true, transactionHash: data.transactionHash, explorerUrl: data.explorerUrl };
      } else {
        console.error('❌ FAILED TO LOG GAME:', data.error);
        toast.error('Failed to log game to blockchain');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error logging game:', error);
      toast.error('Network error while logging game');
      return { success: false, error: 'Network error' };
    } finally {
      setIsLogging(false);
    }
  };

  const getGameHistory = async (limit = 50): Promise<GameHistoryEntry[]> => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`/api/game-history?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        return data.games || [];
      } else {
        console.error('Failed to fetch game history:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const getGame = async (gameId: number): Promise<GameHistoryEntry | null> => {
    try {
      const response = await fetch(`/api/game-history?gameId=${gameId}`);
      const data = await response.json();

      if (data.success) {
        return data.game;
      } else {
        console.error('Failed to fetch game:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching game:', error);
      return null;
    }
  };

  return {
    logGame,
    getGameHistory,
    getGame,
    isLogging,
    isLoadingHistory,
  };
};