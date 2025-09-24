'use client';
import { useState, useEffect } from 'react';
import GradientBorderButton from './GradientBorderButton';
import AptosConnectWalletButton from './AptosConnectWalletButton';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  
  // Auto rotate through steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(current => current < 4 ? current + 1 : 1);
        setTimeout(() => setAnimating(false), 300);
      }, 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const steps = [
    {
      id: 1,
      title: 'Connect Your Wallet',
      description: 'Link your Web3 wallet in seconds to unlock the full APT Casino experience. We support Keyless login Walets, Petra, MetaMask, NNS and all major Web3 wallets.',
      emoji: '👛'
    },
    {
      id: 2,
      title: 'Get APTC Tokens',
      description: 'Power your gameplay with APT tokens built on Aptos Network. Easily swap from any token or other cryptocurrencies.',
      emoji: '💰'
    },
    {
      id: 3,
      title: 'Start Playing',
      description: 'Dive into our expanding library of provably fair games including Roulette, Plinko, Mines and Spin Wheel. Every game provides real-time stats and detailed history.',
      emoji: '🎮'
    },
    {
      id: 4,
      title: 'Earn Rewards',
      description: 'Win APT tokens and unlock exclusive perks through our multi-tiered loyalty program. Earn cashback on losses and gain access to tournaments.',
      emoji: '🏆'
    },
  ];
  
  const handleStepChange = (stepId) => {
    if (stepId === activeStep) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(stepId);
      setTimeout(() => setAnimating(false), 300);
    }, 300);
  };
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-blue-magic/5 blur-[120px] z-0"></div>
      <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-red-magic/5 blur-[120px] z-0"></div>
      
      {/* Floating orbs background */}
      <div className="absolute top-10 right-10 w-6 h-6 rounded-full bg-red-magic/20 animate-float"></div>
      <div className="absolute top-40 left-1/4 w-4 h-4 rounded-full bg-blue-magic/20 animate-float-delay"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-1 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mb-5"></div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">How APT Casino Works</h2>
          <p className="text-white/70 max-w-2xl text-lg">Experience the future of decentralized gaming in four seamless steps</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Navigation */}
          <div className="p-[1px] bg-gradient-to-r from-red-magic via-purple-500 to-blue-magic rounded-xl shadow-xl">
            <div className="bg-[#1A0015]/70 backdrop-blur-sm rounded-xl p-5">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`mb-4 p-4 rounded-lg cursor-pointer transition-all duration-300 transform ${
                    activeStep === step.id 
                      ? 'bg-gradient-to-r from-[#250020] to-[#1A0015] border-l-2 border-red-magic scale-[1.02]' 
                      : 'hover:bg-[#250020]/50 hover:scale-[1.01]'
                  } ${step.id < activeStep ? 'opacity-90' : 'opacity-100'}`}
                  onClick={() => handleStepChange(step.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'bg-gradient-to-r from-red-magic to-blue-magic scale-110' 
                        : 'bg-[#250020]'
                    }`}>
                      <span className="text-white text-lg">{step.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg transition-all duration-300 ${activeStep === step.id ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-magic to-blue-magic' : 'text-white'}`}>
                        {step.title}
                      </h3>
                      <p className={`mt-2 text-sm leading-relaxed ${activeStep === step.id ? 'text-white/90' : 'text-white/60'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 flex justify-center lg:justify-start">
                {activeStep === 1 ? (
                  <AptosConnectWalletButton />
                ) : (
                  <GradientBorderButton className="transform hover:scale-105 transition-transform">
                    {activeStep === 2 ? 'Get APTC Tokens' : 
                     activeStep === 3 ? 'Browse Games' : 'View Rewards'}
                  </GradientBorderButton>
                )}
              </div>
            </div>
          </div>
          
          {/* Illustration Area */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xl h-[400px]">
              {/* Progress indicator */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    className={`w-6 h-2 rounded-full transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'bg-gradient-to-r from-red-magic to-blue-magic w-10' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    onClick={() => handleStepChange(step.id)}
                    aria-label={`Go to step ${step.id}`}
                  />
                ))}
              </div>
              
              {/* Animated background elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 bg-gradient-to-r from-red-magic/10 to-blue-magic/10 rounded-full animate-pulse"></div>
                <div className="absolute w-80 h-80 border border-white/5 rounded-full animate-spin-slow"></div>
              </div>
              
              {/* Main illustration card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-[1px] bg-gradient-to-r from-red-magic via-purple-500 to-blue-magic rounded-2xl shadow-2xl">
                  <div className="bg-[#1A0015]/70 backdrop-blur-sm rounded-2xl p-10 w-[380px] h-[380px] flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                    {/* Animated glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-magic to-blue-magic opacity-75 blur-2xl transition duration-1000 rounded-2xl"></div>
                    
                    {/* Step indicator - moved to top right corner */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-red-magic to-blue-magic flex items-center justify-center text-white text-base font-bold shadow-lg z-20 border border-white/20">
                      {activeStep}/4
                    </div>
                    
                    <div className={`relative flex flex-col items-center text-center transform transition-all duration-500 px-4 ${animating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                      <div className="w-28 h-28 rounded-full bg-gradient-to-r from-red-magic to-blue-magic p-1 flex items-center justify-center mb-8 shadow-lg transform hover:rotate-6 transition-transform relative">
                        <div className="absolute inset-0 rounded-full bg-[#250020] opacity-40"></div>
                        <div className="relative z-10 transform hover:scale-110 transition-transform">
                          <span className="text-6xl">{steps[activeStep-1].emoji}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-white text-2xl font-semibold mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {steps[activeStep-1].title}
                      </h3>
                      <p className="text-white/80 leading-relaxed text-base max-w-xs">
                        {steps[activeStep-1].description}
                      </p>
                    </div>
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

export default HowItWorksSection; 