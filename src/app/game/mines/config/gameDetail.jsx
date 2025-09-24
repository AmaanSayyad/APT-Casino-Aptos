export const gameData = {
  label: "Game Description",
  title: "Mines",
  image: "/images/games/mines.png",
  description: "Unearth hidden gems while avoiding mines in this thrilling crypto game!",
  youtube: "https://www.youtube.com/embed/Aqz5C7GPrvQ?si=XZlr0I0rGt9CtuHW",
  paragraphs: [
    "Select mines on a 5x5 grid – more mines mean higher rewards but greater risk.",
    "Uncover gems while avoiding mines to increase your multiplier. Cash out anytime or keep going for bigger rewards.",
    "With provably fair gameplay and instant payouts, Mines offers the perfect blend of strategy and luck.",
  ],
};

export const bettingTableData = {
  title: "Mines Payouts",
  description:
    "Your potential payout increases with each safe tile you reveal. The more mines you select at the start, the higher your potential rewards will be.",
  table: [
    {
      mines: 1,
      tiles: [
        { revealed: 1, multiplier: "1.04x" },
        { revealed: 5, multiplier: "1.26x" },
        { revealed: 10, multiplier: "1.67x" },
        { revealed: 15, multiplier: "2.50x" },
        { revealed: 20, multiplier: "5.00x" }
      ]
    },
    {
      mines: 3,
      tiles: [
        { revealed: 1, multiplier: "1.16x" },
        { revealed: 5, multiplier: "2.06x" },
        { revealed: 10, multiplier: "4.40x" },
        { revealed: 15, multiplier: "13.20x" },
        { revealed: 20, multiplier: "100.00x" }
      ]
    },
    {
      mines: 5,
      tiles: [
        { revealed: 1, multiplier: "1.31x" },
        { revealed: 5, multiplier: "3.28x" },
        { revealed: 10, multiplier: "10.90x" },
        { revealed: 15, multiplier: "54.50x" },
        { revealed: 18, multiplier: "220.00x" }
      ]
    },
    {
      mines: 10,
      tiles: [
        { revealed: 1, multiplier: "1.80x" },
        { revealed: 5, multiplier: "9.00x" },
        { revealed: 10, multiplier: "70.00x" },
        { revealed: 12, multiplier: "210.00x" },
        { revealed: 14, multiplier: "1,000.00x" }
      ]
    }
  ]
};

export const gameStatistics = {
  totalBets: '956,421',
      totalVolume: '4.7M APTC',
    avgBetSize: '1.85 APTC',
    maxWin: '1,217.50 APTC'
};

export const recentBigWins = [
      { player: "CryptoMiner", amount: "1,217.50 APTC", time: "3m ago", config: "10 mines" },
    { player: "DiamondHands", amount: "892.50 APTC", time: "10m ago", config: "5 mines" },
    { player: "GemHunter", amount: "653.00 APTC", time: "22m ago", config: "3 mines" },
    { player: "RiskTaker", amount: "437.00 APTC", time: "45m ago", config: "3 mines" },
    { player: "TreasureSeeker", amount: "381.50 APTC", time: "1h ago", config: "1 mine" }
];

export const winProbabilities = [
  { config: '1 mine (24 safe tiles)', probability: 96.0, color: 'from-green-500 to-green-700' },
  { config: '3 mines (22 safe tiles)', probability: 88.0, color: 'from-teal-500 to-teal-700' },
  { config: '5 mines (20 safe tiles)', probability: 80.0, color: 'from-blue-500 to-blue-700' },
  { config: '10 mines (15 safe tiles)', probability: 60.0, color: 'from-yellow-500 to-yellow-700' },
  { config: '15 mines (10 safe tiles)', probability: 40.0, color: 'from-red-500 to-red-700' }
];
