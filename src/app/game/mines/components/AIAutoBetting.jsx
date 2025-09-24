import React, { useState, useEffect } from 'react';
import { FaRobot, FaCog, FaBrain, FaChartLine, FaRegLightbulb, FaExternalLinkAlt, FaSyncAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const AIAutoBetting = ({ onActivate, isActive, onSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('balanced'); // balanced, aggressive, conservative
  const [aiThinking, setAiThinking] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, profit: 0, avgMultiplier: 0 });
  const { theme } = useTheme();

  // AI Thinking Animation
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setAiThinking(prev => !prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  // Simulate AI making a decision
  useEffect(() => {
    if (isActive && !lastAction) {
      const actions = [
        { action: 'Analyzing risk patterns...', recommendation: 'Reveal 3 more tiles for optimal return' },
        { action: 'Calculating win probability...', recommendation: '72.4% chance of safe next move' },
        { action: 'Evaluating position...', recommendation: 'Current position favorable for +2 reveals' },
        { action: 'Scanning historical data...', recommendation: 'Similar patterns suggest cashout after next tile' }
      ];
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLastAction(randomAction);
      
      const timer = setTimeout(() => {
        setLastAction(null);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, lastAction, aiThinking]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    // Would update AI strategy based on selected mode
  };

  const getStrategyDescription = () => {
    switch (currentMode) {
      case 'aggressive':
        return 'Maximizes potential wins with higher risk exposure';
      case 'conservative':
        return 'Prioritizes capital preservation with lower risk tolerance';
      default:
        return 'Balanced approach between risk and reward';
    }
  };

  return (
    <div className="relative z-20">
      <motion.div 
        className={`fixed bottom-6 right-6 ${
          isOpen ? 'w-80' : 'w-auto'
        } overflow-hidden rounded-2xl shadow-2xl border-2 ${
          isActive ? 'border-blue-500/50 bg-gradient-to-r from-blue-900/90 to-indigo-900/90' 
                   : 'border-purple-800/30 bg-gradient-to-r from-purple-900/80 to-black/80'
        }`}
        animate={{ width: isOpen ? 320 : 'auto', height: 'auto' }}
        transition={{ duration: 0.3 }}
      >
        {/* Header/Toggle Button */}
        <div 
          className={`p-3 flex justify-between items-center cursor-pointer ${
            isActive ? 'bg-blue-800/30' : 'bg-purple-900/30'
          }`}
          onClick={toggleOpen}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              isActive 
                ? 'bg-blue-900/50 border border-blue-600/30' 
                : 'bg-purple-900/50 border border-purple-800/30'
            }`}>
              <FaRobot className={`text-xl ${isActive ? 'text-blue-300' : 'text-purple-400'}`} />
            </div>
            <div>
              <h3 className="font-medium text-white">AI Auto-Betting</h3>
              {isActive && (
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-1.5 ${aiThinking ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`}></div>
                  <p className="text-xs text-blue-300">Active</p>
                </div>
              )}
              {!isActive && <p className="text-xs text-purple-300">Inactive</p>}
            </div>
          </div>
          <div className="h-8 w-8 flex items-center justify-center">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${isActive ? 'text-blue-300' : 'text-purple-300'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
        
        {/* AI Panel Content */}
        {isOpen && (
          <div className="p-4">
            {/* AI Status & Actions */}
            <div className="mb-4">
              <div className={`rounded-xl p-3 ${
                isActive ? 'bg-blue-900/30 border border-blue-800/30' : 'bg-purple-900/30 border border-purple-800/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-white flex items-center">
                    <FaBrain className={`mr-2 ${isActive ? 'text-blue-400' : 'text-purple-400'}`} />
                    AI Status
                  </h4>
                  <div className="flex items-center">
                    <AnimatePresence>
                      {isActive && aiThinking && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex items-center justify-center mr-2"
                        >
                          <FaSyncAlt className="text-blue-400 animate-spin text-xs" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>
                
                {isActive ? (
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                      <span>Mode: <span className="text-blue-300 font-medium">{currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}</span></span>
                      <span>Model: <span className="text-blue-300">APT GamingGPT v2</span></span>
                    </div>
                    <AnimatePresence>
                      {lastAction && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-black/30 p-2 rounded-lg border border-blue-900/30 text-xs"
                        >
                          <div className="mb-1.5 text-blue-300">{lastAction.action}</div>
                          <div className="flex items-start">
                            <FaRegLightbulb className="text-yellow-400 mt-0.5 mr-1.5 flex-shrink-0" />
                            <span className="text-white/90">{lastAction.recommendation}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-white/70 text-xs">
                    AI is currently inactive. Enable it to automatically make optimal betting decisions and maximize your returns.
                  </p>
                )}
              </div>
            </div>
            
            {/* Strategy Selection */}
            <div className="mb-4">
              <h4 className="font-medium text-sm text-white flex items-center mb-2">
                <FaChartLine className={`mr-2 ${isActive ? 'text-blue-400' : 'text-purple-400'}`} />
                AI Strategy
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleModeChange('conservative')}
                  className={`p-2 rounded-lg text-xs font-medium ${
                    currentMode === 'conservative' 
                      ? 'bg-green-900/50 border border-green-800/50 text-green-300' 
                      : 'bg-black/30 border border-gray-800/50 text-white/70 hover:bg-black/40'
                  }`}
                >
                  Conservative
                </button>
                <button 
                  onClick={() => handleModeChange('balanced')}
                  className={`p-2 rounded-lg text-xs font-medium ${
                    currentMode === 'balanced' 
                      ? 'bg-blue-900/50 border border-blue-800/50 text-blue-300' 
                      : 'bg-black/30 border border-gray-800/50 text-white/70 hover:bg-black/40'
                  }`}
                >
                  Balanced
                </button>
                <button 
                  onClick={() => handleModeChange('aggressive')}
                  className={`p-2 rounded-lg text-xs font-medium ${
                    currentMode === 'aggressive' 
                      ? 'bg-red-900/50 border border-red-800/50 text-red-300' 
                      : 'bg-black/30 border border-gray-800/50 text-white/70 hover:bg-black/40'
                  }`}
                >
                  Aggressive
                </button>
              </div>
              <p className="mt-2 text-xs text-white/70">{getStrategyDescription()}</p>
            </div>
            
            {/* Performance Stats */}
            {isActive && (
              <div className="mb-4">
                <h4 className="font-medium text-sm text-white flex items-center mb-2">
                  <FaChartLine className="mr-2 text-blue-400" />
                  AI Performance
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/30 p-2 rounded-lg border border-blue-900/30">
                    <div className="text-white/60 text-xs mb-1">Session W/L</div>
                    <div className="text-white text-sm font-medium">{stats.wins}W - {stats.losses}L</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-blue-900/30">
                    <div className="text-white/60 text-xs mb-1">Profit</div>
                    <div className={`text-sm font-medium ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.profit >= 0 ? '+' : ''}{stats.profit} APT
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={onSettings}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-blue-900/50 border border-blue-800/30 text-blue-300 hover:bg-blue-800/50'
                    : 'bg-purple-900/50 border border-purple-800/30 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                <FaCog className="mr-1.5" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={onActivate}
                className={`flex-1 ml-2 flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-red-600/80 hover:bg-red-700/80 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                {isActive ? 'Disable AI' : 'Enable AI Agent'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AIAutoBetting; 