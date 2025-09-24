"use client";
import React, { useState } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Tooltip, LinearProgress, IconButton, Collapse } from '@mui/material';
import { FaTrophy, FaFire, FaMedal, FaCrown, FaChevronRight, FaChevronDown, FaChevronUp, FaGlobe, FaUserFriends, FaStar } from 'react-icons/fa';
import { GiPokerChips, GiMineExplosion, GiDiamonds, GiGoldBar } from 'react-icons/gi';

// Sample data - in real application this would come from API
const leaderboardData = [
  { 
    id: 1, 
    username: 'MineMaster', 
    avatar: '/images/avatars/avatar1.png', 
    winnings: 256780,
    winStreak: 8,
    winRate: 72,
    isVIP: true,
    badge: 'diamond',
    country: 'United States',
    flag: '🇺🇸',
    bestConfig: '5 mines',
    maxMultiplier: '17.2x',
    lastWin: '1 hour ago'
  },
  { 
    id: 2, 
    username: 'GemHunter', 
    avatar: '/images/avatars/avatar2.png', 
    winnings: 195420,
    winStreak: 5,
    winRate: 65,
    isVIP: true, 
    badge: 'platinum',
    country: 'Canada',
    flag: '🇨🇦',
    bestConfig: '8 mines',
    maxMultiplier: '38.4x',
    lastWin: '4 hours ago'
  },
  { 
    id: 3, 
    username: 'DiamondDigger', 
    avatar: '/images/avatars/avatar3.png', 
    winnings: 167890,
    winStreak: 3,
    winRate: 61,
    isVIP: false,
    badge: 'gold',
    country: 'UK',
    flag: '🇬🇧',
    bestConfig: '3 mines',
    maxMultiplier: '9.8x',
    lastWin: '1 day ago'
  },
  { 
    id: 4, 
    username: 'TreasureSeeker', 
    avatar: '/images/avatars/avatar4.png', 
    winnings: 103450,
    winStreak: 2,
    winRate: 54,
    isVIP: false,
    badge: 'silver',
    country: 'Germany',
    flag: '🇩🇪',
    bestConfig: '10 mines',
    maxMultiplier: '72.5x',
    lastWin: '3 days ago'
  },
  { 
    id: 5, 
    username: 'LuckyMiner', 
    avatar: '/images/avatars/avatar5.png', 
    winnings: 92370,
    winStreak: 2,
    winRate: 49,
    isVIP: false,
    badge: 'bronze',
    country: 'Japan',
    flag: '🇯🇵',
    bestConfig: '7 mines',
    maxMultiplier: '24.9x',
    lastWin: '4 days ago'
  }
];

// Badge components with different colors
const BadgeIcon = ({ type }) => {
  switch(type) {
    case 'diamond':
      return <FaCrown style={{ color: '#00bcd4' }} />;
    case 'platinum':
      return <FaCrown style={{ color: '#e0e0e0' }} />;
    case 'gold':
      return <FaStar style={{ color: '#ffc107' }} />;
    case 'silver':
      return <FaMedal style={{ color: '#b0bec5' }} />;
    case 'bronze':
      return <FaMedal style={{ color: '#bf8970' }} />;
    default:
      return null;
  }
};

const MinesLeaderboard = () => {
  const [expanded, setExpanded] = useState({});
  
  const handleExpandClick = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
};

export default MinesLeaderboard; 