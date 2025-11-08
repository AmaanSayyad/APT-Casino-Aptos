'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProvablyFairSection = () => {
  const [activeTab, setActiveTab] = useState(1);
  
  const steps = [
    {
      id: 1,
      title: 'On-Chain Randomness Request',
      description: 'When you place a bet, our smart contract requests randomness from Aptos\'s on-chain randomness module. This happens directly on the blockchain, ensuring no manipulation is possible.',
      icon: 'randomness-request'
    },
    {
      id: 2,
      title: 'Aptos Randomness Module',
      description: 'Aptos\'s built-in randomness module (Aptos Roll) generates cryptographically secure random numbers using verifiable random functions (VRF). The randomness is generated on-chain and is publicly verifiable.',
      icon: 'aptos-randomness'
    },
    {
      id: 3,
      title: 'Game Result Calculation',
      description: 'The game result is calculated directly in the smart contract using the on-chain random number. Since everything happens on-chain, you can verify the result by checking the transaction on Aptos Explorer.',
      icon: 'calculation'
    },
    {
      id: 4,
      title: 'Blockchain Verification',
      description: 'Every game result is permanently recorded on the Aptos blockchain. You can verify any game by checking the transaction hash on Aptos Explorer, ensuring complete transparency and fairness.',
      icon: 'verification'
    },
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 relative">
      {/* Background accents */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-magic/5 blur-[100px] z-0"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-magic/5 blur-[100px] z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <div className="w-1 h-6 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">Provably Fair Gaming</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left explanation column */}
          <div className="lg:col-span-5">
            <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl h-full">
              <div className="bg-[#1A0015] rounded-xl p-6 h-full">
                <h3 className="text-white text-xl font-medium mb-4">What is Provably Fair?</h3>
                <p className="text-white/80 mb-6">
                  Provably Fair gaming on Aptos uses the blockchain's built-in on-chain randomness module to ensure complete transparency and fairness. 
                  Unlike traditional online casinos that operate as "black boxes," our system uses Aptos's verifiable random functions (VRF) 
                  to generate game outcomes directly on-chain, making every result independently verifiable.
                </p>
                
                <div className="bg-[#250020] p-4 rounded-lg mb-6 border-l-2 border-red-magic">
                  <h4 className="text-white font-medium mb-2">Why it matters</h4>
                  <ul className="text-white/70 text-sm space-y-2 list-disc pl-4">
                    <li>Impossible for the casino to manipulate results</li>
                    <li>Game outcomes can be independently verified</li>
                    <li>You don't need to trust us - you can verify yourself</li>
                    <li>Results are determined by cryptographic algorithms</li>
                  </ul>
                </div>
                
                <Link href="/provably-fair">
                  <div className="inline-block">
                    <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-md inline-block">
                      <button className="bg-[#1A0015] hover:bg-[#250020] transition-colors text-white px-6 py-2 rounded-md flex items-center">
                        Verify Your Games
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right steps column */}
          <div className="lg:col-span-7">
            <div className="p-[1px] bg-gradient-to-r from-red-magic/40 to-blue-magic/40 rounded-xl">
              <div className="bg-[#1A0015] rounded-xl p-6">
                <h3 className="text-white text-xl font-medium mb-4">How It Works</h3>
                
                {/* Steps tabs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      className={`p-2 rounded-md text-sm font-medium transition-all text-center ${
                        activeTab === step.id
                          ? 'bg-gradient-to-r from-red-magic/80 to-blue-magic/80 text-white'
                          : 'bg-[#250020] text-white/70 hover:text-white'
                      }`}
                      onClick={() => setActiveTab(step.id)}
                    >
                      Step {step.id}
                    </button>
                  ))}
                </div>
                
                {/* Active tab content */}
                <div className="min-h-[250px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      {/* Step icon placeholder - would be actual icons in production */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-magic/60 to-blue-magic/60 flex items-center justify-center mr-4">
                        <span className="text-white font-bold">{activeTab}</span>
                      </div>
                      <h4 className="text-white text-lg font-medium">{steps[activeTab-1].title}</h4>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed mb-8">
                      {steps[activeTab-1].description}
                    </p>
                  </div>
                  
                  {/* Code example - In a real implementation this would be more detailed */}
                  <div className="bg-[#0D0D0D] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
                      {activeTab === 1 && '// Smart contract requests randomness\n#[randomness]\nentry fun place_bet(user: &signer, amount: u64) {\n    // Request on-chain randomness\n    let random = randomness::u64_range(0, 37);\n    // Use random number for game result\n}'}
                      {activeTab === 2 && '// Aptos Randomness Module (Aptos Roll)\nuse aptos_framework::randomness;\n\n// Generate random number in range [0, 36]\nlet roll: u8 = (randomness::u64_range(0, 37) as u8);\n\n// Randomness is cryptographically secure\n// and verifiable on-chain'}
                      {activeTab === 3 && '// Calculate game result on-chain\nlet (win, payout) = settle(\n    amount, \n    bet_kind, \n    bet_value, \n    roll  // From Aptos randomness\n);\n\n// Result is deterministic and verifiable\n// All logic is in smart contract'}
                      {activeTab === 4 && '// Verify on Aptos Explorer\n// Transaction hash: 0x...\n// View transaction details:\n// - Random number used\n// - Game result\n// - Payout amount\n\n// All data is on-chain and immutable'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvablyFairSection; 