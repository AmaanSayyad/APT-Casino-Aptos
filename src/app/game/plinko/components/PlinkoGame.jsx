"use client";
import { useState, forwardRef, useImperativeHandle, useCallback, useEffect, useRef } from "react";
import Matter from 'matter-js';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance, addToBalance } from '@/store/balanceSlice';
import { useGameLogger } from '@/hooks/useGameLogger';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const PlinkoGame = forwardRef(({ rowCount = 16, riskLevel = "Medium", onRowChange, betAmount = 0, onBetHistoryChange }, ref) => {
  const dispatch = useDispatch();
  const userBalance = useSelector((state) => state.balance.userBalance);
  const { logGame } = useGameLogger();
  const { account } = useWallet();
  
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState(null);
  const [hitPegs, setHitPegs] = useState(new Set());
  const [currentRows, setCurrentRows] = useState(rowCount);
  const [currentRiskLevel, setCurrentRiskLevel] = useState(riskLevel);
  const [isRecreating, setIsRecreating] = useState(false);
  const [betHistory, setBetHistory] = useState([]);
  
  // Physics engine refs
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Audio refs (drop and bin land only)
  const ballDropAudioRef = useRef(null);
  const binLandAudioRef = useRef(null);
  
  const playAudio = (ref) => {
    try {
      const audio = ref.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch {}
  };
  
  useEffect(() => {
    if (ballDropAudioRef.current) ballDropAudioRef.current.volume = 0.6;
    if (binLandAudioRef.current) binLandAudioRef.current.volume = 0.7;
  }, []);

  // Watch for changes in rowCount or riskLevel props and update local state
  useEffect(() => {
    console.log('PlinkoGame: rowCount prop changed to:', rowCount);
    console.log('PlinkoGame: riskLevel prop changed to:', riskLevel);
    console.log('PlinkoGame: New configuration:', getRowConfig(rowCount, riskLevel));
    setIsRecreating(true);
    setCurrentRows(rowCount);
    setCurrentRiskLevel(riskLevel);
    setBallPosition(null);
    setHitPegs(new Set());
    
    // Keep bet amount when configuration changes, it will be updated via betAmount prop
    console.log('PlinkoGame: Configuration changed, current bet amount:', parseFloat(betAmount) || 0);
    
    // Clear any existing ball or game state
    if (engineRef.current) {
      const Engine = Matter.Engine;
      Engine.clear(engineRef.current);
    }
    
    // Small delay to show loading state and ensure cleanup
    setTimeout(() => {
      setIsRecreating(false);
    }, 100);
  }, [rowCount, riskLevel]);

  // Keep the latest bet amount in a ref for use in async handlers
  const betAmountRef = useRef(0);
  useEffect(() => {
    betAmountRef.current = parseFloat(betAmount) || 0;
  }, [betAmount]);

  // Game constants - matching the reference repo
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDING_X = 52;
  const PADDING_TOP = 36;
  const PADDING_BOTTOM = 28;
  
  // Pin and ball categories for collision filtering
  const PIN_CATEGORY = 0x0001;
  const BALL_CATEGORY = 0x0002;

  // Row-specific configurations for bins and multipliers - Following 16 row logic: binCount = rows + 1
  const getRowConfig = (rows, riskLevel) => {
    const configs = {
      Low: {
        8: {
          binCount: 9,
          multipliers: ["5.6x", "2.1x", "1.1x", "1x", "0.5x", "1x", "1.1x", "2.1x", "5.6x"]
        },
        9: {
          binCount: 10,
          multipliers: ["5.6x", "2x", "1.6x", "1x", "0.7x", "0.7x", "1x", "1.6x", "2x", "5.6x"]
        },
        10: {
          binCount: 11,
          multipliers: ["8.9x", "3x", "1.4x", "1.1x", "1x", "0.5x", "1x", "1.1x", "1.4x", "3x", "8.9x"]
        },
        11: {
          binCount: 12,
          multipliers: ["8.4x", "3x", "1.9x", "1.3x", "1x", "0.7x", "0.7x", "1x", "1.3x", "1.9x", "3x", "8.4x"]
        },
        12: {
          binCount: 13,
          multipliers: ["10x", "3x", "1.6x", "1.4x", "1.1x", "1x", "0.5x", "1x", "1.1x", "1.4x", "1.6x", "3x", "10x"]
        },
        13: {
          binCount: 14,
          multipliers: ["8.1x", "4x", "3x", "1.9x", "1.2x", "0.9x", "0.7x", "0.7x", "0.9x", "1.2x", "1.9x", "3x", "4x", "8.1x"]
        },
        14: {
          binCount: 15,
          multipliers: ["7.1x", "4x", "1.9x", "1.4x", "1.3x", "1.1x", "1x", "0.5x", "1x", "1.1x", "1.3x", "1.4x", "1.9x", "4x", "7.1x"]
        },
        15: {
          binCount: 16,
          multipliers: ["15x", "8x", "3x", "2x", "1.5x", "1.1x", "1x", "0.7x", "0.7x", "1x", "1.1x", "1.5x", "2x", "3x", "8x", "15x"]
        },
        16: {
          binCount: 17,
          multipliers: ["16x", "9x", "2x", "1.4x", "1.4x", "1.2x", "1.1x", "1x", "0.5x", "1x", "1.1x", "1.2x", "1.4x", "1.4x", "2x", "9x", "16x"]
        }
      },
      Medium: {
        8: {
          binCount: 9,
          multipliers: ["13x", "3x", "1.3x", "0.7x", "0.4x", "0.7x", "1.3x", "3x", "13x"]
        },
        9: {
          binCount: 10,
          multipliers: ["18x", "4x", "1.7x", "0.9x", "0.5x", "0.5x", "0.9x", "1.7x", "4x", "18x"]
        },
        10: {
          binCount: 11,
          multipliers: ["22x", "5x", "2x", "1.4x", "0.6x", "0.4x", "0.6x", "1.4x", "2x", "5x", "22x"]
        },
        11: {
          binCount: 12,
          multipliers: ["24x", "6x", "3x", "1.8x", "0.7x", "0.5x", "0.5x", "0.7x", "1.8x", "3x", "6x", "24x"]
        },
        12: {
          binCount: 13,
          multipliers: ["33x", "11x", "4x", "2x", "1.1x", "0.6x", "0.3x", "0.6x", "1.1x", "2x", "4x", "11x", "33x"]
        },
        13: {
          binCount: 14,
          multipliers: ["43x", "13x", "6x", "1.3x", "0.7x", "0.4x", "0.4x", "0.4x", "0.7x", "1.3x", "3x", "6x", "13x", "43x"]
        },
        14: {
          binCount: 15,
          multipliers: ["58x", "15x", "7x", "4x", "1.9x", "1x", "0.5x", "0.2x", "0.5x", "1x", "1.9x", "4x", "7x", "15x", "58x"]
        },
        15: {
          binCount: 16,
          multipliers: ["88x", "18x", "11x", "5x", "3x", "1.3x", "0.5x", "0.3x", "0.3x", "0.5x", "1.3x", "3x", "5x", "11x", "18x", "88x"]
        },
        16: {
          binCount: 17,
          multipliers: ["110x", "41x", "10x", "5x", "3x", "1.5x", "1x", "0.5x", "0.3x", "0.5x", "1x", "1.5x", "3x", "5x", "10x", "41x", "110x"]
        }
      },
      High: {
        8: {
          binCount: 9,
          multipliers: ["29x", "4x", "1.5x", "0.3x", "0.2x", "0.3x", "1.5x", "4x", "29x"]
        },
        9: {
          binCount: 10,
          multipliers: ["43x", "7x", "2x", "0.6x", "0.2x", "0.2x", "0.6x", "2x", "7x", "43x"]
        },
        10: {
          binCount: 11,
          multipliers: ["76x", "10x", "3x", "0.9x", "0.3x", "0.2x", "0.3x", "0.9x", "3x", "10x", "76x"]
        },
        11: {
          binCount: 12,
          multipliers: ["120x", "14x", "5.2x", "1.4x", "0.4x", "0.2x", "0.2x", "0.4x", "1.4x", "5.2x", "14x", "120x"]
        },
        12: {
          binCount: 13,
          multipliers: ["170x", "24x", "8.1x", "2x", "0.7x", "0.2x", "0.2x", "0.2x", "0.7x", "2x", "8.1x", "24x", "170x"]
        },
        13: {
          binCount: 14,
          multipliers: ["260x", "37x", "11x", "4x", "1x", "0.2x", "0.2x", "0.2x", "0.2x", "1x", "4x", "11x", "37x", "260x"]
        },
        14: {
          binCount: 15,
          multipliers: ["420x", "56x", "18x", "5x", "1.9x", "0.3x", "0.2x", "0.2x", "0.2x", "0.3x", "1.9x", "5x", "18x", "56x", "420x"]
        },
        15: {
          binCount: 16,
          multipliers: ["620x", "83x", "27x", "8x", "3x", "0.5x", "0.2x", "0.2x", "0.2x", "0.2x", "0.5x", "3x", "8x", "27x", "83x", "620x"]
        },
        16: {
          binCount: 17,
          multipliers: ["1000x", "130x", "26x", "9x", "4x", "2x", "0.2x", "0.2x", "0.2x", "0.2x", "0.2x", "2x", "4x", "9x", "26x", "130x", "1000x"]
        }
      }
    };
    
    // Get the risk level config, default to Medium if invalid
    const riskConfig = configs[riskLevel] || configs.Medium;
    // Get the row config, default to 16 rows if invalid
    return riskConfig[rows] || riskConfig[16];
  };

  // Get current row configuration
  const currentConfig = getRowConfig(currentRows, currentRiskLevel);
  const multipliers = currentConfig.multipliers;
  const binCount = currentConfig.binCount;

  // Ball friction parameters by row count (from reference repo)
  const getBallFrictions = (rows) => {
    return {
      friction: 0.5,
      frictionAir: 0.0364 + (16 - rows) * 0.002, // Adjust friction based on row count
    };
  };

  // Calculate pin distance and radius
  const getPinDistanceX = (rows) => {
    // For the last row, we need to distribute binCount pins across the available width
    const availableWidth = CANVAS_WIDTH - PADDING_X * 2;
    // Slightly increase pin distance for 16 rows to better align with reward boxes
    const pinDistanceX = rows === 16 ? 
      (availableWidth / (binCount - 1)) * 1.05 : 
      availableWidth / (binCount - 1);
    console.log(`Pin distance X: ${pinDistanceX} for ${binCount} bins, available width: ${availableWidth}`);
    return pinDistanceX;
  };

  const getPinRadius = (rows) => {
    return Math.max(2, (24 - rows) / 2); // Minimum 2px radius
  };

  // Generate pins with exact positioning from reference repo
  const generatePins = (rows) => {
    const pins = [];
    const pinsLastRowXCoords = [];
    let pegId = 0;
    
    const pinDistanceX = getPinDistanceX(rows);
    
    for (let row = 0; row < rows; row++) {
      const rowY = PADDING_TOP + ((CANVAS_HEIGHT - PADDING_TOP - PADDING_BOTTOM) / (rows - 1)) * row;
      
      // Calculate pins in this row - EXACTLY from AnsonH/plinko-game
      let pinsInRow;
      if (row === rows - 1) {
        // Last row should have binCount + 1 pins (pins between reward boxes)
        pinsInRow = binCount + 1;
      } else {
        // Other rows follow the pattern: 3 + row (starts with 3, adds 1 per row)
        pinsInRow = 3 + row;
      }
      
      // Center the pins in each row
      const rowPaddingX = PADDING_X + ((CANVAS_WIDTH - PADDING_X * 2 - pinDistanceX * (pinsInRow - 1)) / 2);
      
      for (let col = 0; col < pinsInRow; col++) {
        const colX = rowPaddingX + pinDistanceX * col;
        
        pins.push({
          id: pegId++,
          row,
          col,
          x: colX,
          y: rowY
        });
        
        // Store last row x coordinates for bin detection
        if (row === rows - 1) {
          pinsLastRowXCoords.push(colX);
        }
      }
    }
    
    console.log(`Generated ${pins.length} pins for ${rows} rows, last row has ${pinsLastRowXCoords.length} pins`);
    console.log(`Row breakdown: ${Array.from({length: rows}, (_, i) => i === rows - 1 ? binCount + 1 : 3 + i)}`);
    console.log(`First row pins: ${pins.filter(p => p.row === 0).map(p => p.x.toFixed(1))}`);
    console.log(`Last row pins: ${pinsLastRowXCoords.map(x => x.toFixed(1))}`);
    return { pins, pinsLastRowXCoords };
  };

  // Initialize physics engine
  const initializePhysics = useCallback((rows, riskLevel) => {
    console.log('PlinkoGame: Initializing physics for', rows, 'rows with risk level:', riskLevel);
    if (typeof window === 'undefined') return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;
    const Composite = Matter.Composite;

    // Clear existing engine if it exists
    if (engineRef.current) {
      Engine.clear(engineRef.current);
    }

    // Create engine
    const engine = Engine.create({
      timing: {
        timeScale: 1,
      },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
        background: 'transparent',
        showVelocity: false,
        showAngleIndicator: false,
        showDebug: false
      }
    });
    renderRef.current = render;

    // Generate pins for current row count
    const { pins, pinsLastRowXCoords } = generatePins(rows);

    // Create pins as static circles
    const pegBodies = [];
    pins.forEach(pin => {
      const pegBody = Bodies.circle(pin.x, pin.y, getPinRadius(rows), {
        isStatic: true,
        render: {
          fillStyle: 'white',
        },
        collisionFilter: {
          category: PIN_CATEGORY,
          mask: BALL_CATEGORY,
        },
      });
      pegBody.pegId = pin.id;
      pegBody.pinData = pin;
      pegBodies.push(pegBody);
    });

    // Create walls (slanted guard rails like in reference repo)
    const firstPinX = pins[0].x;
    const lastRowFirstPinX = pinsLastRowXCoords[0];
    const lastRowLastPinX = pinsLastRowXCoords[pinsLastRowXCoords.length - 1];
    
    // Calculate wall angles based on the first and last row pin positions
    const leftWallAngle = Math.atan2(
      firstPinX - lastRowFirstPinX,
      CANVAS_HEIGHT - PADDING_TOP - PADDING_BOTTOM,
    );
    const rightWallAngle = Math.atan2(
      lastRowLastPinX - firstPinX,
      CANVAS_HEIGHT - PADDING_TOP - PADDING_BOTTOM,
    );
    
    // Position walls slightly outside the pin boundaries
    const leftWallX = lastRowFirstPinX - getPinDistanceX(rows) * 0.5;
    const rightWallX = lastRowLastPinX + getPinDistanceX(rows) * 0.5;

    const leftWall = Bodies.rectangle(
      leftWallX,
      CANVAS_HEIGHT / 2,
      10,
      CANVAS_HEIGHT,
      {
        isStatic: true,
        angle: leftWallAngle,
        render: { visible: false },
      },
    );
    
    const rightWall = Bodies.rectangle(
      rightWallX,
      CANVAS_HEIGHT / 2,
      10,
      CANVAS_HEIGHT,
      {
        isStatic: true,
        angle: -rightWallAngle,
        render: { visible: false },
      },
    );

    // Create sensor at bottom for bin detection
    const sensor = Bodies.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT,
      CANVAS_WIDTH,
      10,
      {
        isSensor: true,
        isStatic: true,
        render: { visible: false },
      },
    );

    // Add all bodies to world
    World.add(engine.world, [...pegBodies, leftWall, rightWall, sensor]);

    // Collision detection
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        
        // Check if ball hit a peg
        if (bodyA.pegId !== undefined || bodyB.pegId !== undefined) {
          const pegBody = bodyA.pegId !== undefined ? bodyA : bodyB;
          setHitPegs(prev => new Set([...prev, pegBody.pegId]));
        }
        
        // Check if ball hit sensor (reached bottom)
        if (bodyA === sensor || bodyB === sensor) {
          const ball = bodyA === sensor ? bodyB : bodyA;
          handleBallEnterBin(ball, pinsLastRowXCoords);
        }
      });
    });

    // Handle ball entering bin (exact logic from reference repo - 16 row logic)
    const handleBallEnterBin = (ball, pinsLastRowXCoords) => {
      // Calculate bin index by snapping to the nearest slot center (between adjacent last-row pins)
      // This avoids boundary bias and matches visual expectation (nearest reward box)
      const gaps = pinsLastRowXCoords.length - 1; // equals binCount
      const x = ball.position.x;

      let nearestIndex = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < gaps; i++) {
        const center = (pinsLastRowXCoords[i] + pinsLastRowXCoords[i + 1]) / 2;
        const dist = Math.abs(x - center);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = i;
        }
      }
      const binIndex = Math.max(0, Math.min(gaps - 1, nearestIndex));
      
      // Debug: Log the bin detection process
      console.log('=== BIN DETECTION DEBUG ===');
      console.log('Row configuration:', rows, 'rows,', riskLevel, 'risk');
      console.log('Ball position X:', ball.position.x);
      console.log('Last row pin X coordinates:', pinsLastRowXCoords);
      console.log('Calculated bin index:', binIndex);
      console.log('Multipliers array length:', multipliers.length);
      console.log('Multipliers:', multipliers);
      console.log('==========================');
      
      // Ensure binIndex is within valid range for multipliers array
      if (binIndex !== -1 && binIndex < multipliers.length) {
        // Set landing animation state
        setBallPosition(binIndex);
        
        // Calculate reward based on multiplier and bet amount (16 row logic)
        const multiplier = multipliers[binIndex];
        const multiplierValue = parseFloat(multiplier.replace('x', ''));
        
        // Use latest bet amount from ref to avoid stale values captured by closures
        const latestBetAmount = betAmountRef.current;
        const reward = latestBetAmount * multiplierValue;
        
        console.log('=== GAME RESULT ===');
        console.log('Row configuration:', rows, 'rows,', riskLevel, 'risk');
        console.log('Bet amount (latest):', betAmountRef.current);
        console.log('Multiplier:', multiplier, '(bin index:', binIndex, ')');
        console.log('Reward calculated:', reward, 'APT');
        console.log('==================');
        
        // Add reward to current balance (bet amount already deducted when ball was spawned)
        if (latestBetAmount > 0) {
          console.log('Adding reward to balance:');
          console.log('  Current balance from Redux:', userBalance);
          console.log('  Current balance in APT:', parseFloat(userBalance) / 100000000);
          console.log('  Reward to add:', reward);
          
          const currentBalance = parseFloat(userBalance);
          const rewardInReduxUnit = reward * 100000000;
          const finalBalance = (currentBalance + rewardInReduxUnit).toFixed(2);
          
          console.log('Reward addition:');
          console.log('  Current balance (Redux unit):', currentBalance);
          console.log('  Current balance (APT):', (currentBalance / 100000000).toFixed(3));
          console.log('  Reward added (Redux unit):', rewardInReduxUnit);
          console.log('  Reward added (APT):', reward);
          console.log('  Final balance (Redux unit):', finalBalance);
          console.log('  Final balance (APT):', (parseFloat(finalBalance) / 100000000).toFixed(3));
          
          dispatch(addToBalance(rewardInReduxUnit));
        }
        
        // Play bin land sound
        playAudio(binLandAudioRef);
        
        // Add to bet history
        const newBetResult = {
          id: Date.now(),
          game: "Plinko",
          title: new Date().toLocaleTimeString(),
          betAmount: latestBetAmount.toFixed(2),
          multiplier: multipliers[binIndex],
          payout: reward.toFixed(2),
          timestamp: Date.now(),
          txHash: null,
          explorerUrl: null
        };
        setBetHistory(prev => {
          const updated = [newBetResult, ...prev.slice(0, 99)]; // Keep last 100
          return updated;
        });
        
        // Notify parent component about bet history change
        if (onBetHistoryChange) {
          onBetHistoryChange(newBetResult);
        }
        
        // Log game to blockchain
        if (account?.address && latestBetAmount > 0) {
          const gameResult = `${rows}rows_${riskLevel}_bin${binIndex}_${multiplier}`;
          logGame({
            gameType: 'plinko',
            playerAddress: account.address,
            betAmount: latestBetAmount,
            result: gameResult,
            payout: reward,
          }).then(res => {
            if (res?.success) {
              console.log('Game successfully logged to blockchain');
              // attach tx hash to latest history entry
              setBetHistory(prev => {
                if (prev.length === 0) return prev;
                const [first, ...rest] = prev;
                const updatedFirst = { ...first, txHash: res.transactionHash || null, explorerUrl: res.explorerUrl || null };
                return [updatedFirst, ...rest];
              });
              if (onBetHistoryChange) {
                onBetHistoryChange({ ...newBetResult, txHash: res.transactionHash || null, explorerUrl: res.explorerUrl || null });
              }
            }
          }).catch(error => {
            console.error('Failed to log game to blockchain:', error);
          });
        }
        
        setTimeout(() => {
          setIsDropping(false);
          console.log(`Ball landed in bin ${binIndex} with multiplier ${multipliers[binIndex]}, payout: $${reward}`);
        }, 100);
      }
      
      // Remove ball from world
      Composite.remove(engine.world, ball);
    };

    // Start the engine
    Engine.run(engine);
    Render.run(render);

    return { pins, pinsLastRowXCoords };
  }, []);

  // Effect to initialize physics when component mounts or rows change
  useEffect(() => {
    const { pins, pinsLastRowXCoords } = initializePhysics(currentRows, currentRiskLevel);
    
    return () => {
      if (renderRef.current) {
        const Render = Matter.Render;
        Render.stop(renderRef.current);
        // Clear the canvas
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (engineRef.current) {
        const Engine = Matter.Engine;
        Engine.clear(engineRef.current);
      }
    };
  }, [currentRows, currentRiskLevel, initializePhysics]);

  // Function to start a bet and drop the ball
  const dropBall = useCallback(() => {
    if (!engineRef.current) return;
    
    // Simple balance check - if user doesn't have enough balance, don't allow playing
    const currentBalance = parseFloat(userBalance);
    const latestBetAmount = betAmountRef.current;
    const betAmountInReduxUnit = latestBetAmount * 100000000;
    
    if (betAmountInReduxUnit > currentBalance) {
      console.warn('Insufficient balance for bet:', {
        currentBalance: currentBalance / 100000000,
        betAmount: latestBetAmount,
        balanceInAPT: (currentBalance / 100000000).toFixed(3)
      });
      alert(`Insufficient balance! You have ${(currentBalance / 100000000).toFixed(3)} APT but need ${latestBetAmount} APT`);
      return;
    }
    
    setIsDropping(true);
    setBallPosition(null);
    setHitPegs(new Set());

    // Deduct bet amount when ball is spawned
    if (latestBetAmount > 0) {
      const newBalance = (currentBalance - betAmountInReduxUnit).toFixed(2);
      dispatch(setBalance(newBalance));
      console.log('Bet amount deducted:', latestBetAmount, 'New balance:', newBalance);
    }

    const Bodies = Matter.Bodies;
    const World = Matter.World;

    // Ball parameters from reference repo
    const ballOffsetRangeX = getPinDistanceX(currentRows) * 0.8;
    const ballRadius = getPinRadius(currentRows) * 2;
    
    // Get first row pin positions to determine ball drop range
    const { pins: currentPins } = generatePins(currentRows);
    const firstRowPins = currentPins.filter(pin => pin.row === 0);
    if (firstRowPins.length === 0) return;
    
    const firstRowStartX = firstRowPins[0].x;
    const firstRowEndX = firstRowPins[firstRowPins.length - 1].x;
    const firstRowCenterX = (firstRowStartX + firstRowEndX) / 2;
    
    // Random start position within the first row pin range
    const startX = firstRowCenterX + (Math.random() - 0.5) * ballOffsetRangeX;

    const ball = Bodies.circle(startX, 0, ballRadius, {
      restitution: 0.8, // Bounciness from reference repo
      friction: getBallFrictions(currentRows).friction,
      frictionAir: getBallFrictions(currentRows).frictionAir,
      collisionFilter: {
        category: BALL_CATEGORY,
        mask: PIN_CATEGORY, // Collide with pins only, not other balls
      },
      render: {
        fillStyle: '#ff6b6b',
      },
    });

    World.add(engineRef.current.world, ball);
    
    // Play drop sound
    playAudio(ballDropAudioRef);
  }, [isDropping, currentRows, userBalance, dispatch]);

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    dropBall
  }), [dropBall]);

  // Generate current pins for rendering
  const { pins, pinsLastRowXCoords } = generatePins(currentRows);

  // Generate gradient colors for multiplier slots
  const getSlotColor = (index) => {
    const totalSlots = multipliers.length;
    const centerIndex = Math.floor(totalSlots / 2);
    const distanceFromCenter = Math.abs(index - centerIndex);
    const maxDistance = centerIndex;
    
    if (index === 0 || index === totalSlots - 1) {
      return "from-pink-500 to-red-500";
    } else if (index === centerIndex) {
      return "from-blue-500 to-purple-500";
    } else {
      const ratio = distanceFromCenter / maxDistance;
      if (ratio > 0.7) {
        return "from-pink-500 to-purple-500";
      } else if (ratio > 0.4) {
        return "from-purple-500 to-blue-500";
      } else {
        return "from-blue-500 to-purple-500";
      }
    }
  };

  // Game statistics state
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestMultiplier, setBestMultiplier] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  
  // Calculate game statistics from betHistory
  useEffect(() => {
    if (betHistory.length > 0) {
      // Count games played
      setGamesPlayed(betHistory.length);
      
      // Find best multiplier
      const bestMulti = betHistory.reduce((best, bet) => {
        const multiplierValue = parseFloat(bet.multiplier.replace('x', ''));
        return Math.max(best, multiplierValue);
      }, 0);
      setBestMultiplier(bestMulti);
      
      // Calculate total won (sum of all payouts - sum of all bet amounts)
      const totalPayouts = betHistory.reduce((sum, bet) => {
        return sum + parseFloat(bet.payout);
      }, 0);
      
      const totalBetAmounts = betHistory.reduce((sum, bet) => {
        return sum + parseFloat(bet.betAmount);
      }, 0);
      
      const total = totalPayouts - totalBetAmounts;
      setTotalWon(total);
      
      console.log('Game stats updated from history:', {
        gamesPlayed: betHistory.length,
        bestMultiplier: bestMulti,
        totalWon: total
      });
    }
  }, [betHistory]);

  return (
    <div className="bg-[#1A0015] rounded-xl border border-[#333947] p-6">


      {/* Plinko Board Container */}
      <div className="relative bg-[#2A0025] rounded-lg p-6 min-h-[600px] flex flex-col items-center">
        {/* Audio elements */}
        <audio ref={ballDropAudioRef} src="/sounds/chip-put.mp3" preload="auto" />
        <audio ref={binLandAudioRef} src="/sounds/win-chips.mp3" preload="auto" />
        {/* Loading Overlay */}
        {isRecreating && (
          <div className="absolute inset-0 bg-[#2A0025] bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Recreating board...</p>
              <p className="text-gray-400 text-sm">Setting up {currentRows} rows with {currentRiskLevel} risk</p>
            </div>
          </div>
        )}
        

        
        {/* Physics Canvas Container */}
        <div className="relative w-full max-w-[800px]">
          {/* Matter.js Canvas - Visible for debugging */}
          <div 
            ref={canvasRef} 
            className="absolute inset-0 opacity-80 pointer-events-none"
            style={{ zIndex: 1 }}
          />
          
          {/* Visual SVG Overlay */}
          <svg className="w-full h-[600px] relative z-10" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            {/* Draw pegs */}
            {pins.map((pin) => (
              <circle
                key={pin.id}
                cx={pin.x}
                cy={pin.y}
                r="6"
                fill={hitPegs.has(pin.id) ? "#ffd700" : "white"}
                className="drop-shadow-sm"
                style={{
                  filter: hitPegs.has(pin.id) 
                    ? "drop-shadow(0 0 15px #ffd700) brightness(1.5)" 
                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                }}
              />
            ))}
          </svg>

                    {/* Bet History - Right Side */}
          <div className="absolute right-4 top-4 z-10">
            <div className="space-y-2">
              {betHistory.slice(0, 5).map((bet, index) => (
                <div key={index} className="w-16 h-16 bg-[#2A0025] border border-[#333947] rounded-lg flex flex-col items-center justify-center p-1">
                  <span className="w-full text-center leading-tight text-xs font-bold text-white">{bet.multiplier}</span>
                  <span className="w-full text-center leading-tight text-[10px] text-green-400">+{bet.payout} APT</span>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 5 - Math.min(5, betHistory.length)) }).map((_, index) => (
                <div key={`empty-${index}`} className="w-16 h-16 bg-[#2A0025] border border-[#333947] rounded-lg flex items-center justify-center opacity-30">
                  <span className="text-xs text-gray-500">-</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multiplier Slots */}
          <div className="flex justify-center mt-4 max-w-[800px] mx-auto">
            <div className={`flex justify-between w-full gap-2 ${currentRows === 16 ? 'px-0' : 'px-4'}`}>
              {multipliers.map((multiplier, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-300 ${
                    ballPosition === index && !isDropping
                      ? "text-yellow-400 font-bold scale-110"
                      : "text-white"
                  }`}
                >
                  <div className={`w-10 h-7 rounded bg-gradient-to-r ${getSlotColor(index)} flex items-center justify-center mb-2 shadow-lg ${
                    ballPosition === index && !isDropping ? 'ring-2 ring-yellow-400' : ''
                  }`}>
                    <span className="text-[10px] font-bold text-white">{multiplier}</span>
                  </div>
                  <div className={`w-10 h-1 rounded-full ${
                    ballPosition === index && !isDropping
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : "bg-[#333947]"
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Use the bet button on the left to start the game</p>
          <p className="mt-1">Current configuration: {currentRows} rows with {currentRiskLevel} risk</p>
        </div>

      </div>

      {/* Game Stats */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{gamesPlayed}</div>
          <div className="text-xs text-gray-400">Games Played</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{bestMultiplier.toFixed(2)}x</div>
          <div className="text-xs text-gray-400">Best Multiplier</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalWon.toFixed(2)} APT</div>
          <div className="text-xs text-gray-400">Total Won</div>
        </div>
      </div>
    </div>
  );
});

PlinkoGame.displayName = 'PlinkoGame';

export default PlinkoGame;