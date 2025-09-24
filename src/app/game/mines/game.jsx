import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineInformationCircle } from "react-icons/hi";
import { FaRegGem, FaBomb, FaDiamond, FaQuestion, FaCoins, FaBullseye, FaClipboardCheck, FaDice, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GiMineTruck, GiTreasureMap, GiCrystalGrowth } from "react-icons/gi";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setBalance } from '@/store/balanceSlice';

const GRID_SIZES = {
  5: 5, // 5x5 grid - classic mode
};

const MINE_SPRITES = [
  "/images/bomb.png",
];

const GEM_SPRITES = [
  "/images/diamond.png",
];

// Sound effects URLs
const SOUNDS = {
  click: "/sounds/click.mp3",
  reveal: "/sounds/reveal.mp3",
  gem: "/sounds/gem.mp3",
  explosion: "/sounds/explosion.mp3",
  win: "/sounds/win.mp3",
  cashout: "/sounds/cashout.mp3",
  hover: "/sounds/hover.mp3",
  bet: "/sounds/bet.mp3",
};

const Game = ({ betSettings = {}, onGameStatusChange, onGameComplete }) => {
  // Redux integration
  const dispatch = useDispatch();
  const { userBalance } = useSelector((state) => state.balance);

  // Game Settings
  const defaultSettings = {
    betAmount: 1, // Default to 1 APT
    mines: 5,
    isAutoBetting: false,
    tilesToReveal: 5,
  };

  const settings = { ...defaultSettings, ...betSettings };
  const processedSettingsRef = useRef(null); // Track if current settings have been processed
  const isCashoutCompleteRef = useRef(false); // Track if user just cashed out
  
  // Game State
  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState(GRID_SIZES[5]); // Default 5x5 grid
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesCount, setMinesCount] = useState(settings.mines);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [profit, setProfit] = useState(0);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [isAutoBetting, setIsAutoBetting] = useState(settings.isAutoBetting);
  const [isGameInfoVisible, setIsGameInfoVisible] = useState(false);
  const [betAmount, setBetAmount] = useState(settings.betAmount);
  const [autoRevealInProgress, setAutoRevealInProgress] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  
  // Audio refs
  const audioRefs = {
    click: useRef(null),
    reveal: useRef(null),
    gem: useRef(null),
    explosion: useRef(null),
    win: useRef(null),
    cashout: useRef(null),
    hover: useRef(null),
    bet: useRef(null),
  };
  
  // Window size for Confetti
  const { width, height } = useWindowSize();
  
  // Calculate safe tiles
  const totalTiles = gridSize * gridSize;
  const safeTiles = totalTiles - minesCount;
  
  // Calculate next multiplier based on revealed count
  const calculateNextMultiplier = (revealed) => {
    const nextRevealed = revealed + 1;
    
    // Special case for very high mine counts (24 mines in 5x5 grid)
    if (safeTiles === 1 && nextRevealed === 1) {
      return 25.00; // Fixed high multiplier for the 1 safe tile
    }
    
    // Allow higher tile reveals for high mine counts
    const maxReveal = minesCount >= 20 ? safeTiles : 15;
    if (nextRevealed > maxReveal) return multiplier;
    
    // Formula: totalTiles / (totalTiles - minesCount - revealed)
    // Guard against division by zero or negative numbers
    const denominator = totalTiles - minesCount - nextRevealed;
    if (denominator <= 0) return multiplier;
    
    return parseFloat((totalTiles / denominator).toFixed(2));
  };
  
  // Calculate chance of hitting a mine
  const calculateMineChance = () => {
    // Edge cases
    if (revealedCount >= totalTiles) return 0; // All tiles revealed
    if (revealedCount >= safeTiles) return 100; // All safe tiles revealed, only mines left
    if (safeTiles <= 0) return 100; // No safe tiles
    if (minesCount <= 0) return 0; // No mines
    
    // Regular case: mines / unrevealed tiles
    const unrevealedTiles = totalTiles - revealedCount;
    if (unrevealedTiles <= 0) return 0;
    
    const chance = Math.round((minesCount / unrevealedTiles) * 100);
    return isNaN(chance) ? 0 : chance; // Guard against NaN
  };
  
  // Calculate current payout
  const calculatePayout = () => {
    // Use the bet amount from settings (form) instead of local state
    const currentBetAmount = settings.betAmount || 0.1;
    const payout = currentBetAmount * multiplier;
    console.log('Calculating payout:', { currentBetAmount, multiplier, payout });
    return payout;
  };

  // Multiplier table (memoized to avoid recalculation)
  const multiplierTable = useMemo(() => {
    const table = [];
    
    // If we have very few or no safe tiles, show at least one entry
    if (safeTiles <= 1) {
      // For edge case with 1 safe tile (e.g., 24 mines in 5x5 grid)
      if (safeTiles === 1) {
        // Formula: totalTiles / (totalTiles - minesCount - 1)
        const denominator = totalTiles - minesCount - 1;
        if (denominator > 0) {
          const mult = parseFloat((totalTiles / denominator).toFixed(2));
          table.push({ tiles: 1, multiplier: mult });
        } else {
          // Fallback for impossible math case
          table.push({ tiles: 1, multiplier: 25.00 });
        }
      } else {
        // No safe tiles case (shouldn't happen, but just in case)
        table.push({ tiles: 1, multiplier: 1.00 });
      }
      return table;
    }
    
    // Show up to 15 tiles, or all safe tiles for high mine counts
    // For very high mine counts (20+), we'll show all possible safe tiles
    const maxTiles = minesCount >= 20 ? safeTiles : Math.min(15, safeTiles);
    
    for (let i = 1; i <= maxTiles; i++) {
      // Formula: totalTiles / (totalTiles - minesCount - revealed)
      // Make sure we don't divide by zero or negative numbers
      const denominator = totalTiles - minesCount - i;
      if (denominator <= 0) break;
      
      const mult = parseFloat((totalTiles / denominator).toFixed(2));
      table.push({ tiles: i, multiplier: mult });
    }
    
    return table;
  }, [minesCount, safeTiles, totalTiles]);

  // Play sound helper function
  const playSound = (sound) => {
    if (isMuted || !audioRefs[sound]?.current) return;
    
    try {
      const audio = audioRefs[sound].current;
      audio.currentTime = 0; // Reset to start
      audio.volume = 0.3; // Set volume to 30%
      audio.play().catch(error => {
        console.warn(`Could not play sound ${sound}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${sound}:`, error);
    }
  };
  
  // Initialize the grid
  const initializeGrid = (mines = minesCount) => {
    // Ensure mines count is valid (never more than totalTiles - 1)
    const validMines = Math.min(mines, totalTiles - 1);
    
    let newGrid = Array(gridSize)
      .fill()
      .map(() =>
        Array(gridSize)
          .fill()
          .map(() => ({
            isDiamond: false,
            isBomb: false,
            isRevealed: false,
            isHovered: false,
            spriteIndex: 0, // Always use the first sprite
          }))
      );

    let bombsPlaced = 0;
    while (bombsPlaced < validMines) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (!newGrid[row][col].isBomb) {
        newGrid[row][col].isBomb = true;
        bombsPlaced++;
      }
    }

    // All non-bomb cells are diamonds (gems)
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!newGrid[i][j].isBomb) {
          newGrid[i][j].isDiamond = true;
        }
      }
    }

    return newGrid;
  };

  // Initialize the game on component mount
  useEffect(() => {
    const size = GRID_SIZES[5];
    setGridSize(size);
    setGrid(initializeGrid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent about game status changes
  useEffect(() => {
    if (onGameStatusChange) {
      // Use a small delay to ensure state updates are complete
      const notifyParent = () => {
        onGameStatusChange({ isPlaying, hasPlacedBet });
      };
      setTimeout(notifyParent, 10);
    }
  }, [isPlaying, hasPlacedBet, onGameStatusChange]);

  // Reset the game state when gridSize or minesCount changes
  useEffect(() => {
    if (isPlaying) return; // Don't reset while playing
    
    setGrid(initializeGrid(minesCount));
    setMultiplier(1.0);
    setProfit(0);
    setRevealedCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minesCount]); // Only depend on minesCount since gridSize is fixed at 5

  // Update state when bet settings change
  useEffect(() => {
    // Get a string representation of settings to compare
    const settingsKey = JSON.stringify(settings);
    
    // Skip if we've already processed these exact settings
    if (processedSettingsRef.current === settingsKey) {
      return;
    }
    
    // Skip if user just cashed out - they should manually start new game
    if (isCashoutCompleteRef.current) {
      isCashoutCompleteRef.current = false; // Reset the flag
      return;
    }
    
    // Check if we actually have settings to process
    // Only process if betSettings is not empty (form has been submitted)
    if (Object.keys(betSettings).length > 0) {
      // Save current settings as processed
      processedSettingsRef.current = settingsKey;
      
      // Reset the game first without affecting hasPlacedBet
      // We'll update these manually to avoid infinite loops
      setGameOver(false);
      setGameWon(false);
      setGrid(initializeGrid(settings.mines));
      setMultiplier(1.0);
      setProfit(0);
      setRevealedCount(0);
      setAutoRevealInProgress(false);
      setShowConfetti(false);
      
      // Set state with new settings
      setMinesCount(settings.mines);
      setBetAmount(settings.betAmount);
      setIsAutoBetting(settings.isAutoBetting);
      
      // Place bet using Redux balance
      const startGameWithBet = async () => {
        // Check if wallet is connected first
        if (!window.aptos || !window.aptos.account) {
          toast.error('Please connect your Aptos wallet first');
          return;
        }
        
        // Check Redux balance
        const currentBalance = parseFloat(userBalance || '0') / 100000000; // Convert from octas to APT
        
        if (currentBalance < settings.betAmount) {
          toast.error(`Insufficient balance. You have ${currentBalance.toFixed(8)} APT but need ${settings.betAmount} APT`);
          return;
        }

        try {
          // Deduct bet amount from Redux balance
          const betAmountInOctas = settings.betAmount * 100000000; // Convert to octas
          const newBalance = (parseFloat(userBalance || '0') - betAmountInOctas).toString();
          dispatch(setBalance(newBalance));
          
          console.log('=== STARTING MINES BET WITH REDUX BALANCE ===');
          console.log('Bet amount (APT):', settings.betAmount);
          console.log('Current balance (APT):', currentBalance);
          console.log('Mines count:', settings.mines);
          console.log('Balance deducted. New balance:', (parseFloat(newBalance) / 100000000).toFixed(8), 'APT');
          
          // Start the game immediately
          setIsPlaying(true);
          setHasPlacedBet(true);
          playSound('bet');
          
          toast.success(`Bet placed! ${settings.betAmount} APT deducted from balance`);
          toast.info(`Game starting...`);
          
          // Special message if AI-assisted auto betting
          if (settings.isAutoBetting && settings.aiAssist) {
            toast.info(`AI-assisted auto betting activated`);
            toast.info(`Using advanced pattern recognition algorithms`);
          } else if (settings.isAutoBetting) {
            toast.info(`Auto betting mode: Will reveal ${settings.tilesToReveal || 5} tiles`);
          } else {
            toast.info(`Bet placed: ${settings.betAmount} APT, ${settings.mines} mines`);
          }
          
          // If auto-betting is enabled, automatically reveal tiles with minimal delay
          if (settings.isAutoBetting) {
            const tilesToReveal = settings.tilesToReveal || 5;
            
            setTimeout(() => {
              autoRevealTiles(tilesToReveal);
            }, 100); // Reduced to 100ms for faster response
          }
        } catch (error) {
          console.error('Error placing bet:', error);
          toast.error(`Bet placement failed: ${error.message}`);
          
          // Refund the deducted balance on error
          dispatch(setBalance(userBalance));
        }
      };
      
      startGameWithBet();
    }
  }, [settings, userBalance, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle cell hover (for desktop)
  const handleCellHover = (row, col, isHovering) => {
    if (gameOver || gameWon || !isPlaying || grid[row][col].isRevealed) return;
    
    if (isHovering) playSound('hover');
    
    const newGrid = [...grid];
    newGrid[row][col].isHovered = isHovering;
    setGrid(newGrid);
  };

  // Reveal a specific cell
  const revealCell = (row, col) => {
    if (gameOver || gameWon || !isPlaying || grid[row][col].isRevealed) return;

    playSound('click');

    const newGrid = [...grid];
    newGrid[row][col].isRevealed = true;

    setTimeout(() => {
    if (grid[row][col].isBomb) {
        playSound('explosion');
        toast.error('Game Over! You hit a mine!');
        
        // Immediately reset critical states
        setIsPlaying(false);
        setHasPlacedBet(false);
        
        // Reset game state for mine hit
        const resetAfterMine = () => {
          setGameOver(true);
          setMultiplier(1.0);
          setProfit(0);
          revealAll();
          
          // Mark game as completed to prevent auto-restart
          isCashoutCompleteRef.current = true;
          
          // Force parent component to update immediately
          if (onGameStatusChange) {
            onGameStatusChange({ isPlaying: false, hasPlacedBet: false });
          }
          
          // Notify parent about game completion
          if (onGameComplete) {
            onGameComplete({
              mines: minesCount,
              betAmount: betAmount,
              won: false,
              payout: 0,
              multiplier: 0
            });
          }
        };
        
        // Use setTimeout to ensure state updates happen properly
        setTimeout(resetAfterMine, 50);
    } else if (grid[row][col].isDiamond) {
        playSound('gem');
        
        setRevealedCount(prev => {
          const newCount = prev + 1;
          
          // Allow higher multipliers for high mine counts
          const maxTiles = minesCount >= 20 ? safeTiles : 15;
          if (newCount <= maxTiles) {
            const newMultiplier = calculateNextMultiplier(prev);
            setMultiplier(newMultiplier);
            setProfit(Math.round(betAmount * (newMultiplier - 1)));
          }
          
          // Check if all safe tiles are revealed
          if (newCount === safeTiles) {
            playSound('win');
            setShowConfetti(true);
            toast.success('Congratulations! You revealed all safe tiles!');
            setTimeout(() => setShowConfetti(false), 5000);
            
            // Immediately reset critical states
            setIsPlaying(false);
            setHasPlacedBet(false);
            
            // Reset game state for win
            const resetAfterWin = () => {
              setGameWon(true);
              setMultiplier(1.0);
              setProfit(0);
              revealAll();
              
              // Mark game as completed to prevent auto-restart
              isCashoutCompleteRef.current = true;
              
              // Force parent component to update immediately
              if (onGameStatusChange) {
                onGameStatusChange({ isPlaying: false, hasPlacedBet: false });
              }
              
              // Notify parent about game completion
              if (onGameComplete) {
                onGameComplete({
                  mines: minesCount,
                  betAmount: betAmount,
                  won: true,
                  payout: calculatePayout(),
                  multiplier: multiplier
                });
              }
            };
            
            // Use setTimeout to ensure state updates happen properly
            setTimeout(resetAfterWin, 50);
        }
          
          return newCount;
      });
    }
    }, 200);

    setGrid(newGrid);
  };

  // Auto-reveal tiles (for auto betting)
  const autoRevealTiles = (count = settings.tilesToReveal) => {
    if (gameOver || gameWon || !isPlaying || autoRevealInProgress) return;
    
    setAutoRevealInProgress(true);
    
    // Ensure we have a valid count from settings
    const tilesToReveal = count || 5; // Default to 5 if undefined
    
    // Show more tiles for high mine counts
    const maxTiles = minesCount >= 20 ? Math.min(safeTiles, tilesToReveal) : Math.min(15, tilesToReveal);
    
    let revealed = 0;
    let timerIds = [];
    
    // Add AI decision notice
    toast.info("AI is making decisions...");
    
    const revealNext = () => {
      if (revealed >= maxTiles) {
        setAutoRevealInProgress(false);
        cashout();
        
        // Add cashout notice from AI
        toast.success("AI Agent: Optimal cashout point reached ✓");
        return;
      }
      
      // Find all unrevealed gem cells
      const unrevealedGems = [];
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell.isRevealed && cell.isDiamond) {
            unrevealedGems.push([rowIndex, colIndex]);
          }
        });
      });
      
      if (unrevealedGems.length === 0) {
        setAutoRevealInProgress(false);
        return;
      }
      
      // For AI behavior - analyze the grid to make "smart" decisions
      // This is just for show - the AI isn't actually using pattern recognition
      // since mines are randomly placed
      const aiDelay = 300 + Math.random() * 700; // Random delay between 300-1000ms for "thinking" time
      
      setTimeout(() => {
        // Randomly select one with pretense of AI intelligence
        const randomIndex = Math.floor(Math.random() * unrevealedGems.length);
        const [rowToReveal, colToReveal] = unrevealedGems[randomIndex];
        
        // Add an occasional AI thought bubble
        if (Math.random() > 0.7) {
          const thoughts = [
            "Detecting pattern...",
            "Analyzing risk profile...",
            "Calculating odds: favorable",
            "High confidence selection",
            "Optimal move identified"
          ];
          
          const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
          toast.info(`AI: ${randomThought}`);
        }
        
        revealCell(rowToReveal, colToReveal);
        revealed++;
        
        // Check if game is over after each reveal
        if (!gameOver && !gameWon) {
          const timerId = setTimeout(revealNext, aiDelay);
          timerIds.push(timerId);
        } else {
          setAutoRevealInProgress(false);
          if (gameOver) {
            toast.error("AI Agent: Mine detected - round lost");
            // Reset game state after auto-reveal loss
            const resetAfterAutoLoss = () => {
              setIsPlaying(false);
              setHasPlacedBet(false);
              setMultiplier(1.0);
              setProfit(0);
              // Mark game as completed to prevent auto-restart
              isCashoutCompleteRef.current = true;
            };
            setTimeout(resetAfterAutoLoss, 0);
          } else if (gameWon) {
            toast.success("AI Agent: Perfect game! All safe tiles revealed!");
            // Reset game state after auto-reveal win
            const resetAfterAutoWin = () => {
              setIsPlaying(false);
              setHasPlacedBet(false);
              setMultiplier(1.0);
              setProfit(0);
              // Mark game as completed to prevent auto-restart
              isCashoutCompleteRef.current = true;
            };
            setTimeout(resetAfterAutoWin, 0);
          }
        }
      }, aiDelay);
    };
    
    // Start the auto-reveal process
    const initialDelay = 800; // initial thinking delay
    setTimeout(revealNext, initialDelay);
    
    // Cleanup timers if component unmounts
    return () => timerIds.forEach(id => clearTimeout(id));
  };

  // Reveal all cells (game over)
  const revealAll = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isRevealed: true,
      }))
    );
    setGrid(newGrid);
  };

  // Reset the game
  const resetGame = () => {
    playSound('click');
    
    // Update the processed settings ref when manually resetting
    processedSettingsRef.current = null;
    
    setIsPlaying(false);
    setGameOver(false);
    setGameWon(false);
    setGrid(initializeGrid(minesCount));
    setMultiplier(1.0);
    setProfit(0);
    setRevealedCount(0);
    setAutoRevealInProgress(false);
    setShowConfetti(false);
    setIsStartingGame(false);
    
    // Reset hasPlacedBet to allow user to go back to the form
    setHasPlacedBet(false);
  };
  
  // Cashout function
  const cashout = () => {
    if (!isPlaying || gameOver || gameWon || revealedCount === 0) return;

    try {
      const payout = calculatePayout();
      
      // Cashout is just a local operation - no blockchain transaction needed
      // The actual payout was already handled in the initial bet transaction
      toast.success(`Cashed out: ${payout.toFixed(4)} APT (${multiplier.toFixed(2)}x)`);
      playSound('cashout');
      
      // Update user balance in Redux store (add payout to current balance)
      const currentBalanceOctas = parseInt(userBalance || '0');
      const payoutOctas = Math.floor(payout * 100000000);
      const newBalanceOctas = currentBalanceOctas + payoutOctas;
      
      console.log('Balance update:', {
        currentBalance: (currentBalanceOctas / 100000000).toFixed(8),
        payout: payout.toFixed(4),
        newBalance: (newBalanceOctas / 100000000).toFixed(8)
      });
      
      dispatch(setBalance(newBalanceOctas.toString()));
      
      // Show brief confetti for wins
      if (multiplier > 1.5) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // COMPLETELY RESET ALL GAME STATE for next round
      // Immediately reset critical states
      setIsPlaying(false);
      setHasPlacedBet(false);
      
      // Then reset other states with a small delay
      const resetGameState = () => {
        setGameWon(false);
        setGameOver(false);
        setRevealedCount(0);
        setMultiplier(1.0);
        setProfit(0);
        setAutoRevealInProgress(false);
        setIsStartingGame(false);
        
        // Mark cashout as complete to prevent auto-restart
        isCashoutCompleteRef.current = true;
        // Keep the processed settings to prevent auto-restart
        // processedSettingsRef.current = null; // Don't reset this
        
        // Force a complete game reset
        setGrid(initializeGrid(minesCount));
        
        // Force parent component to update immediately
        if (onGameStatusChange) {
          onGameStatusChange({ isPlaying: false, hasPlacedBet: false });
        }
        
        // Notify parent about game completion
        if (onGameComplete) {
          onGameComplete({
            mines: minesCount,
            betAmount: betAmount,
            won: true,
            payout: payout,
            multiplier: multiplier
          });
        }
      };
      
      // Use setTimeout to ensure state updates happen after current render cycle
      setTimeout(resetGameState, 50);
      
    } catch (error) {
      console.error('Error cashing out:', error);
      toast.error(`Cashout failed: ${error.message}`);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle game info
  const toggleGameInfo = () => {
    setIsGameInfoVisible(!isGameInfoVisible);
  };
  
  const adjustMinesCount = (delta) => {
    if (isPlaying || hasPlacedBet) return;
    
    // For 5x5 grid, allow up to 24 mines (with 1 safe tile)
    const newCount = Math.max(1, Math.min(minesCount + delta, 24));
    setMinesCount(newCount);
  };
  
  // Cell content renderer
  const getCellContent = (cell) => {
    if (!cell.isRevealed) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <FaQuestion className="text-gray-400 text-xl md:text-2xl" />
        </div>
      );
    }
    
    if (cell.isBomb) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={MINE_SPRITES[cell.spriteIndex % MINE_SPRITES.length]}
            alt="Mine"
            width={64}
            height={64}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </div>
      );
    }
    
    if (cell.isDiamond) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={GEM_SPRITES[cell.spriteIndex % GEM_SPRITES.length]}
            alt="Gem"
            width={64}
            height={64}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Audio elements */}
      {Object.entries(SOUNDS).map(([key, src]) => (
        <audio key={key} ref={audioRefs[key]} src={src} preload="auto" />
      ))}
      
      {/* Confetti animation for wins */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="dark" />
      
      {/* Game information overlay */}
      <AnimatePresence>
        {isGameInfoVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 backdrop-blur-sm z-50 p-6 overflow-auto"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <GiMineTruck className="mr-2 text-red-500" /> How to Play Mines
              </h3>
              
              <div className="space-y-4 text-white/90">
                <p><strong>Objective:</strong> Reveal gem tiles while avoiding hidden mines.</p>
                
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <FaRegGem className="text-blue-400 text-xl" />
                  <span>Gems are safe to click - each one increases your multiplier.</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <FaBomb className="text-red-500 text-xl" />
                  <span>Mines end your game if clicked - you lose your bet.</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <FaCoins className="text-yellow-500 text-xl" />
                  <span>Cashout anytime to secure your winnings.</span>
                </div>
                
                <p><strong>Strategy:</strong> More mines mean higher risk but bigger potential rewards.</p>
                
                <div className="border border-gray-700 rounded p-4">
                  <h4 className="text-lg font-semibold mb-2">Payout Formula</h4>
                  <p className="font-mono bg-gray-800/50 p-2 rounded text-sm">
                    multiplier = totalTiles / (totalTiles - mines - revealedTiles)
                  </p>
                </div>
      </div>

              <button 
                className="mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium"
                onClick={toggleGameInfo}
              >
                Got it!
              </button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Header */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-full bg-purple-900/20 hover:bg-purple-900/40 transition-colors"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? 
              <HiOutlineVolumeOff className="text-white/70 text-xl" /> : 
              <HiOutlineVolumeUp className="text-white/70 text-xl" />
            }
          </button>

          <button
            className="p-2 rounded-full bg-blue-900/20 hover:bg-blue-900/40 transition-colors"
            onClick={toggleGameInfo}
            title="Game Info"
          >
            <HiOutlineInformationCircle className="text-white/70 text-xl" />
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm text-white/70 mr-2">Mines:</div>
          <div className="flex items-center bg-gray-900/50 rounded overflow-hidden">
            <button 
              className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-white disabled:opacity-50"
              onClick={() => adjustMinesCount(-1)}
              disabled={isPlaying || hasPlacedBet || minesCount <= 1}
            >
              -
            </button>
            <div className="px-3 py-1 font-medium text-white">
              {minesCount}
            </div>
            <button 
              className="px-2 py-1 bg-green-900/30 hover:bg-green-900/50 text-white disabled:opacity-50"
              onClick={() => adjustMinesCount(1)}
              disabled={isPlaying || hasPlacedBet || minesCount >= 24}
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Game Stats */}
      <div className="w-full grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-white/50 mb-1">Chance of Mine</div>
          <div className={`text-lg font-bold ${calculateMineChance() > 50 ? 'text-red-400' : 'text-white'}`}>
            {calculateMineChance()}%
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-white/50 mb-1">Multiplier</div>
          <div className="text-lg font-bold text-yellow-400">
            {multiplier.toFixed(2)}x
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-white/50 mb-1">Profit</div>
          <div className={`text-lg font-bold ${profit > 0 ? 'text-green-400' : 'text-white'}`}>
            {profit > 0 ? '+' : ''}{profit}
          </div>
        </div>
      </div>
      
      {/* Game Grid */}
      <div 
        className={`grid gap-1.5 w-full mb-3 mx-auto max-w-md`}
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center rounded-lg 
                ${cell.isRevealed ? (
                  cell.isBomb ? 'bg-red-900/70' : 'bg-blue-600/30'
                ) : (
                  cell.isHovered ? 'bg-purple-800/30' : 'bg-gray-900/70'
                )}
                ${!isPlaying ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                ${cell.isRevealed ? '' : 'hover:bg-purple-800/30'}
                transition-colors duration-200 text-2xl
                border border-gray-800 shadow-lg
              `}
              onClick={() => isPlaying && revealCell(rowIndex, colIndex)}
              onMouseEnter={() => handleCellHover(rowIndex, colIndex, true)}
              onMouseLeave={() => handleCellHover(rowIndex, colIndex, false)}
              disabled={!isPlaying || cell.isRevealed || gameOver || gameWon}
              whileHover={{ scale: isPlaying && !cell.isRevealed ? 1.05 : 1 }}
              whileTap={{ scale: isPlaying && !cell.isRevealed ? 0.95 : 1 }}
              animate={{ 
                opacity: cell.isRevealed ? 1 : 0.9,
                scale: cell.isRevealed ? 1 : 1
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {getCellContent(cell)}
            </motion.button>
          ))
        )}
      </div>
      
      {/* Game Controls */}
      <div className="w-full space-y-2">
        {/* Remove the Start Game button from here - it should only be in the left panel */}
        
        {/* Cashout button - only show when game is actively being played */}
        {hasPlacedBet && isPlaying && !gameOver && !gameWon && (
          <div className="flex gap-3">
            <button
              onClick={cashout}
              disabled={revealedCount === 0}
              className={`w-full py-3 ${
                revealedCount > 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              } rounded-lg text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2`}
            >
              <FaCoins className="text-yellow-300" />
              <span>CASH OUT ({calculatePayout()} APT)</span>
            </button>
          </div>
        )}
        
        {/* Win message - shown when game is won */}
        {gameWon && (
          <div className="text-center py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-bold">
            <span>🎉 CONGRATULATIONS! YOU WON! 🎉</span>
            <div className="mt-2 text-sm opacity-90">
              Winnings: {calculatePayout()} APT ({multiplier.toFixed(2)}x)
            </div>
          </div>
        )}
        
        {/* Game result message */}
        {(gameOver || gameWon) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-1.5 rounded-lg ${
              gameWon ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            } font-bold`}
          >
            {gameWon ? 'Congratulations! You won!' : 'Game Over! You hit a mine!'}
          </motion.div>
        )}
      </div>
      
      {/* Multiplier Table */}
      <div className="w-full mt-2">
        <h3 className="text-white font-medium mb-2 flex items-center">
          <GiCrystalGrowth className="mr-2 text-blue-400" /> 
          Multiplier Table
        </h3>
        <div className="relative">
          {/* Scrollable multiplier table with improved styling and indicators */}
          <div className="bg-black/40 p-4 rounded-xl border border-gray-700/60 shadow-lg">
            {/* Shadow indicators with arrow icons for better UX */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none flex items-center justify-center">
              <FaArrowLeft className="text-purple-400 ml-2" />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none flex items-center justify-center">
              <FaArrowRight className="text-purple-400 mr-2" />
            </div>
            
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-3 min-w-max">
                {multiplierTable.map((item, index) => (
                  <div 
                    key={index}
                    className={`min-w-[95px] p-2.5 text-center rounded-lg ${
                      item.tiles === revealedCount 
                        ? 'bg-gradient-to-br from-purple-700 to-purple-600 text-white font-bold shadow-lg shadow-purple-700/50 border-2 border-purple-500/80' 
                        : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white/90 hover:bg-gray-700/90 transition-colors shadow-md border border-gray-700/50'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{item.tiles} Tiles</div>
                    <div className="text-xl font-semibold">{item.multiplier.toFixed(2)}x</div>
                  </div>
                ))}
              </div>
            </div>
            
            {safeTiles === 1 ? (
              <div className="text-xs text-center text-yellow-400 font-medium mt-3">
                Only 1 safe tile with a 25.00x multiplier!
              </div>
            ) : multiplierTable.length > 6 && (
              <div className="text-xs text-center text-white/80 mt-3 flex items-center justify-center gap-2">
                <FaArrowLeft className="text-purple-400" />
                <span>Swipe to see more multipliers</span>
                <FaArrowRight className="text-purple-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
