'use client';

import { useState, useEffect } from "react";
import HeaderText from "@/components/HeaderText";
import Image from "next/image";
import MagicBorder from "./MagicBorder";
import Link from "next/link";
import { FaFire, FaUsers, FaTrophy, FaStar, FaBolt, FaChevronRight } from "react-icons/fa";
import GradientBorderButton from "@/components/GradientBorderButton";

const MostPlayed = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleGames, setVisibleGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredGameIndex, setFeaturedGameIndex] = useState(0);
  
  const games = [
    { 
      name: "Roulette", 
      img: "/images/games/roulette.png", 
      link: "/game/roulette",
      players: 842,
      categories: ["featured", "table"],
      isHot: true,
      winRate: "97.3%",
    },
    { 
      name: "Plinko", 
      img: "/images/games/plinko.png", 
      link: "/game/plinko",
      players: 534,
      categories: ["instant", "featured"],
      isHot: true,
      winRate: "97.1%",
    },
    { 
      name: "Mines", 
      img: "/images/games/mines.png", 
      link: "/game/mines",
      players: 456,
      categories: ["featured", "instant"],
      isHot: true,
      winRate: "97.1%",
    },
    { 
      name: "Spin Wheel", 
      img: "/images/games/spin_the_wheel.png", 
      link: "/game/wheel",
      players: 398,
      categories: ["featured", "instant"],
      isHot: true,
      winRate: "96.8%",
    },
    { 
      name: "Fortune Tiger", 
      img: "/images/games/fortune-tiger.png", 
      link: "/game/fortune-tiger",
      players: 651,
      categories: ["slots", "jackpot"],
      isHot: true,
      winRate: "96.8%",
    },
    { 
      name: "Poker", 
      img: "/images/games/poker.png", 
      link: "/game/poker",
      players: 347,
      categories: ["card", "table"],
      isHot: false,
      winRate: "98.2%",
    },
    { 
      name: "Gates of Olympus", 
      img: "/images/games/gates-of-olympus.png", 
      link: "/game/gates-of-olympus",
      players: 523,
      categories: ["slots", "featured"],
      isHot: true,
      winRate: "96.5%",
    },
    { 
      name: "Carp Diem", 
      img: "/images/games/Carp_diem.png", 
      link: "/game/carp-diem",
      players: 218,
      categories: ["slots"],
      isHot: false,
      winRate: "97.1%",
    },
    { 
      name: "Fire Portal", 
      img: "/images/games/fire_portal.png", 
      link: "/game/fire-portal",
      players: 289,
      categories: ["instant"],
      isHot: false,
      winRate: "96.9%",
    },
    { 
      name: "Revenge of Loki", 
      img: "/images/games/revenge_of_loki.png", 
      link: "/game/revenge-of-loki",
      players: 176,
      categories: ["slots"],
      isHot: false,
      winRate: "97.4%",
    },
    { 
      name: "Sugar Rush", 
      img: "/images/games/sugar_rush.png", 
      link: "/game/sugar-rush",
      players: 325,
      categories: ["slots", "jackpot"],
      isHot: false,
      winRate: "96.2%",
    },
    { 
      name: "Crash", 
      img: "/images/games/crash.png", 
      link: "/game/crash",
      players: 712,
      categories: ["instant", "featured"],
      isHot: true,
      winRate: "97.8%",
    },
    { 
      name: "Fire in the Hole", 
      img: "/images/games/fire_in_the_hole.png", 
      link: "/game/fire-in-the-hole",
      players: 198,
      categories: ["slots"],
      isHot: false,
      winRate: "96.7%",
    },
    { 
      name: "Dices", 
      img: "/images/games/dices.png", 
      link: "/game/dices",
      players: 435,
      categories: ["table", "instant"],
      isHot: false,
      winRate: "98.5%",
    },
  ];
  
  const filters = [
    { id: "all", label: "All Games" },
    { id: "featured", label: "Featured" },
    { id: "table", label: "Table Games" },
    { id: "slots", label: "Slots" },
    { id: "card", label: "Card Games" },
    { id: "instant", label: "Instant Win" },
    { id: "jackpot", label: "Jackpot" },
  ];
  
  // Filter games when active filter changes
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (activeFilter === "all") {
        setVisibleGames(games);
      } else {
        setVisibleGames(games.filter(game => game.categories.includes(activeFilter)));
      }
      setIsLoading(false);
    }, 300);
  }, [activeFilter]);
  
  // Rotate featured game
  useEffect(() => {
    // Only feature games with "featured" category
    const featuredGames = games.filter(game => game.categories.includes("featured"));
    
    const interval = setInterval(() => {
      setFeaturedGameIndex(prev => (prev + 1) % featuredGames.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const featuredGames = games.filter(game => game.categories.includes("featured"));
  const currentFeaturedGame = featuredGames[featuredGameIndex];
  
  return (
    <section className="container mx-auto px-4 pt-4 pb-16 relative">
      {/* Background accents */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-magic/5 blur-[100px] z-0"></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-red-magic/5 blur-[80px] z-0"></div>
      
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <HeaderText
          header="Popular Casino Games"
          description="Experience our most played games with the highest win rates and biggest payouts"
        />
      </div>
      
      {/* Featured Game Spotlight */}
      {currentFeaturedGame && (
        <div className="mb-16 overflow-hidden">
          <div className="p-[1px] bg-gradient-to-r from-red-magic to-blue-magic rounded-xl">
            <div className="bg-black/80 rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                <div className="md:w-1/3 relative">
                  <MagicBorder>
                    <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg">
                      <Image
                        src={currentFeaturedGame.img}
                        alt={currentFeaturedGame.name}
                        fill
                        quality={100}
                        className="rounded-lg object-cover"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-magic to-blue-magic text-white text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1">
                        <FaFire className="text-yellow-300" /> TOP PICK
                      </div>
                    </div>
                  </MagicBorder>
                </div>
                
                <div className="md:w-2/3 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                      {currentFeaturedGame.name}
                    </h3>
                    {/* Live indicator for specific games */}
                    {(currentFeaturedGame.name === 'Roulette' || currentFeaturedGame.name === 'Plinko' || currentFeaturedGame.name === 'Mines' || currentFeaturedGame.name === 'Spin Wheel') && (
                      <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-500/30 px-2 py-0.5 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">LIVE</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                      <FaUsers className="text-green-400" />
                      <span>{currentFeaturedGame.players} Players</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                      <FaTrophy className="text-yellow-400" />
                      <span>{currentFeaturedGame.winRate} Win Rate</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-6 max-w-2xl">
                    Experience the thrill of {currentFeaturedGame.name} - one of our most popular games. 
                    Join hundreds of players who are winning big with provably fair gameplay.
                  </p>
                  
                  <Link href={typeof currentFeaturedGame.link === 'string' ? currentFeaturedGame.link : `/game/${currentFeaturedGame.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <button className="bg-gradient-to-r from-red-magic to-blue-magic hover:from-blue-magic hover:to-red-magic transition-all duration-300 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                      Play {currentFeaturedGame.name} Now <FaChevronRight />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Game Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-red-magic to-blue-magic text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Games Grid with Loading State */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
          {visibleGames.map((game, i) => (
            <div 
              key={i} 
              className="group relative flex flex-col transition-all duration-300 hover:translate-y-[-8px]"
            >
              <Link href={typeof game.link === 'string' ? game.link : `/game/${game.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full">
                <MagicBorder>
                  <div className="aspect-[1/1] relative overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={game.img}
                      alt={game.name}
                      fill
                      quality={90}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ objectFit: 'cover' }}
                    />
                    
                    {/* Game metrics floating indicators */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-xs py-1 px-2 rounded-full flex items-center gap-1.5">
                      <FaUsers className="text-green-400" />
                      <span>{game.players}</span>
                    </div>
                    
                    {game.isHot && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs py-1 px-2 rounded-full flex items-center gap-1.5">
                        <FaFire className="text-yellow-300" /> HOT
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {game.winRate} RTP
                        </span>
                        <span className="bg-gradient-to-r from-red-magic to-blue-magic px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <FaBolt /> PLAY
                        </span>
                      </div>
                    </div>
                  </div>
                </MagicBorder>
                
                <div className="mt-3 flex flex-col items-center">
                  <div className="flex items-center gap-2 justify-center">
                    <h3 className="font-display text-sm md:text-base font-semibold tracking-wide text-white text-center">
                      {game.name}
                    </h3>
                    {/* Live indicator for specific games */}
                    {(game.name === 'Roulette' || game.name === 'Plinko' || game.name === 'Mines' || game.name === 'Spin Wheel') && (
                      <div className="flex items-center gap-1 bg-green-900/30 border border-green-500/30 px-1.5 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-400 text-[10px] font-medium">LIVE</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-[10px]" />
                    ))}
                  </div>
                  <span className="mt-2 inline-block py-1 px-2 text-xs rounded-full bg-gradient-to-r from-red-magic to-blue-magic text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Play Now
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Empty state if no games found */}
      {!isLoading && visibleGames.length === 0 && (
        <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5">
          <div className="text-white/50 mb-4 text-6xl">🎮</div>
          <h3 className="text-xl text-white mb-2">No games found</h3>
          <p className="text-white/70 mb-4">Try selecting a different category</p>
          <button
            onClick={() => setActiveFilter("all")}
            className="bg-gradient-to-r from-red-magic to-blue-magic text-white px-4 py-2 rounded-full text-sm"
          >
            View All Games
          </button>
        </div>
      )}
      
     
    </section>
  );
};

export default MostPlayed;