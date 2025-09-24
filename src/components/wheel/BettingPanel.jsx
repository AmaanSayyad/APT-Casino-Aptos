"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";
import coin from "../../../public/coin.png";
// import { wheelDataByRisk } from "./GameWheel"; // Make sure this is exported

const BettingPanel = ({
  betAmount,
  setBetAmount,
  balance,
  gameMode,
  setGameMode,
  risk,
  setRisk,
  noOfSegments,
  setSegments,
  manulBet,
  autoBet,
  isSpinning
}) => {
  
  const [inputValue, setInputValue] = useState('0.1');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setBetAmount(parseFloat(value) || 0);
  };

  const handleMultiplier = (multiplier) => {
    const newAmount = Math.min(balance, Math.max(0, betAmount * multiplier));
    setBetAmount(newAmount);
    setInputValue(newAmount.toString());
  };

  const [numberOfBets, setNumberOfBets] = useState(10);
  const [winIncrease, setWinIncrease] = useState(0);
  const [lossIncrease, setLossIncrease] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);


  return (
    <div className="bg-[#290023] border border-[#333947] rounded-3xl p-4 flex flex-col h-full">
      {/* Mode Tabs */}
      <div className="flex mb-4 bg-[#120521] border border-[#333947] rounded-3xl p-2 gap-2 overflow-hidden">
        <div className={cn("w-1/2", gameMode === "manual" && "gradient-borderb")}>
          <button 
            className={cn(
              "flex-1 py-3 px-4 w-full text-center rounded-2xl transition-colors",
              gameMode === "manual" ? "bg-[#290023] text-white" : "text-[#333947]"
            )}
            onClick={() => setGameMode("manual")}
          >
            Manual
          </button>
        </div>
        <div className={cn("w-1/2", gameMode === "auto" && "gradient-borderb")}>
          <button 
            className={cn(
              "flex-1 py-3 px-4 w-full text-center rounded-2xl transition-colors",
              gameMode === "auto" ? "bg-[#290023] text-white" : "text-[#333947]"
            )}
            onClick={() => setGameMode("auto")}
          >
            Auto
          </button>
        </div>
      </div>

      
      {/* Bet Amount */}
      <div className="mb-4">
        <div className="flex justify-between p-1 mb-1">
          <label className="text-sm text-white">Bet Amount</label>
          <div className="text-sm">${betAmount.toFixed(2)}</div>
        </div>
        <div className="flex w-full gradient-border">
        <div className="flex items-center w-[60%]">
          <div className="bg-[#120521] rounded-l-sm flex-1 flex items-center p-1 py-2 ">
            <input
              type="number"
              step="0.01"
              value={inputValue}
              onChange={handleInputChange}
              className="bg-transparent border-none outline-none w-full text-white p-1"
              placeholder="0.00000000000"
            />
            <Image
                  src={coin}
                  width={20}
                  height={20}
                  alt="coin"
                  className=""
            />  
          </div>
        </div>
        <div className="flex w-[40%]">
          <button onClick={() => handleMultiplier(1 / 2)} className="flex-1 bg-[#420039] py-1 px-2 text-sm transition-colors">1/2</button>
          <button onClick={() => handleMultiplier(2)} className="flex-1 bg-[#420039] py-1 px-2 rounded-r-sm text-sm transition-colors">2x</button>
        </div>
        </div>
      </div>

      {/* Risk */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Risk</label>
        <div className="relative gradient-border">
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full bg-[#120521] p-2 py-3 rounded-sm appearance-none text-white pr-8 outline-none">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className="mb-4">
        <label className="block text-sm text-white mb-1">Segments</label>
        <div className="relative gradient-border">
          <select value={noOfSegments} onChange={(e) => setSegments(parseInt(e.target.value))} className="w-full bg-[#120521] p-2 py-3 rounded-sm appearance-none text-white pr-8 outline-none">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>

          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {gameMode === "auto" && (
        <>
          {/* Number of Bets */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">Numbers of bet</label>
            <div className="gradient-border">
            <input type="number" className="w-full bg-[#120521] text-white p-2 py-3 rounded-sm outline-none" value={numberOfBets} onChange={(e) => setNumberOfBets(Number(e.target.value))} />
            </div>
          </div>

          {/* On Win */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">On win</label>
            <div className="flex gradient-border">
              <div className="bg-[#09011C] p-1 rounded-sm flex w-full">
                <div className="bg-[#420039] p-1 flex items-center rounded-sm w-[60vw]">
                  <button
                    onClick={() => setWinIncrease(0)}
                    className="w-full bg-gradient-to-r from-[#F1324D] to-[#2414E3] rounded-sm py-2 text-white text-sm"
                  >
                    Reset
                  </button>
                  <span className="w-full items-center justify-center text-white text-right pr-3 text-sm">Increase by:</span>
                </div>
                <div className="flex items-center px-2 w-[40vw]">
                  <input type="number" className="bg-transparent outline-none border-none text-white w-full text-sm" value={winIncrease} onChange={(e) => setWinIncrease(e.target.value)} />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* On Loss */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">On Loss</label>
            <div className="flex gradient-border">
              <div className="bg-[#09011C] p-1 rounded-sm flex w-full">
                <div className="bg-[#420039] p-1 flex items-center rounded-sm w-[60vw]">
                  <button
                    onClick={() => setLossIncrease(0)}
                    className="w-full bg-gradient-to-r from-[#F1324D] to-[#2414E3] rounded-sm py-2 text-white text-sm"
                  >
                    Reset
                  </button>
                  <span className="w-full items-center justify-center text-white text-right pr-3 text-sm">Increase by:</span>
                </div>
                <div className="flex items-center px-2 w-[40vw]">
                  <input type="number" className="bg-transparent outline-none border-none text-white w-full text-sm" value={lossIncrease} onChange={(e) => setLossIncrease(e.target.value)} />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stop on Profit */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">Stop on profit</label>
            <div className="gradient-border">
            <div className="flex items-center bg-[#120521] p-2 py-3 rounded-sm">
              <input type="number" className="bg-transparent outline-none border-none text-white w-full" value={stopProfit} onChange={(e) => setStopProfit(e.target.value)} />
              <Image
                  src={coin}
                  width={20}
                  height={20}
                  alt="coin"
                  className=""
                />  
            </div>
            </div>
          </div>

          {/* Stop on Loss */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-1">Stop on Loss</label>
            <div className="gradient-border">
            <div className="flex items-center bg-[#120521] p-2 py-3 rounded-sm">
              <input type="number" className="bg-transparent outline-none border-none text-white w-full" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
              <Image
                  src={coin}
                  width={20}
                  height={20}
                  alt="coin"
                  className=""
                />  
            </div>
            </div>
          </div>
        </>
      )}

      {/* Start AutoBet Button */}
      <button
        onClick={() => {
          if (gameMode === "auto") {
            autoBet({
              numberOfBets,
              winIncrease: winIncrease / 100,
              lossIncrease: lossIncrease / 100,
              stopProfit,
              stopLoss,
              betAmount,
              risk,
              noOfSegments,
            });
          } else {
            manulBet();
          }
        }}
        disabled={isSpinning || betAmount <= 0 || betAmount > balance}
        className={`py-3 mt-4 rounded-lg text-center font-semibold transition-all w-full ${
          isSpinning || betAmount <= 0 || betAmount > balance
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#F1324D] to-[#2414E3] text-white hover:from-[#e82f49] hover:to-[#2112e1]"
        }`}
      >
        {gameMode === "auto" ? "Start Autobet" : "Start Bet"}
      </button>

    </div>
  );
};

export default BettingPanel;