import { wheelDataByRisk } from "../components/wheel/GameWheel"; // Make sure this is exported

export const calculateResult = (risk, noOfSegments) => {
  
  const wheelData = risk === "high" ? wheelDataByRisk.high(noOfSegments) : wheelDataByRisk[risk];

  // Pick index based on probability
  const rand = Math.random();
  let cumulative = 0;
  let selectedIndex = 0;

  for (let i = 0; i < wheelData.length; i++) {
    cumulative += wheelData[i].probability;
    if (rand <= cumulative) {
      selectedIndex = i;
      break;
    }
  }

  const multiplier = wheelData[selectedIndex].multiplier;

  // Find all matching segment indices (in case of duplicate multipliers)
  const matchingSegments = [];
  for (let i = 0; i < noOfSegments; i++) {
    if (wheelData[i % wheelData.length].multiplier === multiplier) {
      matchingSegments.push(i);
    }
  }

  const chosenSegment = matchingSegments[Math.floor(Math.random() * matchingSegments.length)];

  const totalSpins = 5;
  const segmentAngle = (Math.PI * 2) / noOfSegments;
  const position = (chosenSegment * segmentAngle) + (Math.PI * 2 * totalSpins);

  return {
    multiplier,
    position
  };
};
/**
 * Validate bet amount
 */
export const validateBet = (amount, balance) => {
  return amount > 0 && amount <= balance;
};

/**
 * Format currency for display
 */
export const formatCurrency = (value) => {
  return value.toFixed(10);
};