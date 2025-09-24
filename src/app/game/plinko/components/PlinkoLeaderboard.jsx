"use client";
import React from 'react';
import { Paper, Typography, Box, Avatar, Chip } from '@mui/material';
import { FaTrophy } from 'react-icons/fa';

const sampleLeaders = [
  { name: 'PlinkoPro', country: 'US', winRate: 68, streaks: 3, time: '2h ago', winnings: '12,450 APTC', color: '#FFD700' },
  { name: 'EdgeHunter', country: 'CA', winRate: 62, streaks: 4, time: '6h ago', winnings: '9,820 APTC', color: '#C0C0C0' },
  { name: 'CenterMaster', country: 'UK', winRate: 59, streaks: 2, time: '1d ago', winnings: '7,360 APTC', color: '#CD7F32' },
  { name: 'RiskTaker', country: 'DE', winRate: 52, streaks: 2, time: '2d ago', winnings: '5,180 APTC', color: '#888' },
  { name: 'RowKing', country: 'JP', winRate: 48, streaks: 2, time: '5d ago', winnings: '4,120 APTC', color: '#777' },
];

const PlinkoLeaderboard = () => {
  return (
    <Paper elevation={5} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, background: 'linear-gradient(135deg, rgba(9,0,5,0.9) 0%, rgba(25,5,30,0.85) 100%)', border: '1px solid rgba(104,29,219,0.2)' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'white', borderBottom: '1px solid rgba(104,29,219,0.3)', pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FaTrophy color="#FFA500" /> Plinko Leaderboard
      </Typography>
      <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>Top players by winnings (mock data).</Typography>
      <Box className="space-y-3">
        {sampleLeaders.map((p, idx) => (
          <Box key={p.name} sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip label={idx + 1} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }} />
              <Avatar sx={{ bgcolor: p.color }}>{p.name[0]}</Avatar>
              <Box>
                <Typography color="white" fontWeight="bold">{p.name}</Typography>
                <Box className="text-xs text-white/60">{p.winRate}% • {p.streaks} streak • {p.time}</Box>
              </Box>
            </Box>
            <Box className="text-right">
              <div className="text-xs text-white/60">Winnings</div>
              <div className="text-green-400 font-bold">{p.winnings}</div>
            </Box>
          </Box>
        ))}
      </Box>
      <Box className="text-xs text-white/50 mt-3">Updated periodically</Box>
    </Paper>
  );
};

export default PlinkoLeaderboard;


