"use client";
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { FaInfoCircle } from 'react-icons/fa';

// Simplified illustrative probabilities; real odds depend on physics and payout tables
const rowsToChances = {
  Low: [
    { label: 'Center (≈1x)', chance: 30, note: 'Best odds' },
    { label: 'Mid (≈1.3–2x)', chance: 15, note: 'Medium odds' },
    { label: 'Edge (high x)', chance: 5, note: 'Rare' },
  ],
  Medium: [
    { label: 'Center (≈0.5–1x)', chance: 28, note: 'Neutral' },
    { label: 'Mid (≈2–5x)', chance: 10, note: 'Medium odds' },
    { label: 'Edge (very high x)', chance: 2, note: 'Rare' },
  ],
  High: [
    { label: 'Center (≈0.2–1x)', chance: 25, note: 'Lower odds' },
    { label: 'Mid (≈3–10x)', chance: 8, note: 'Medium odds' },
    { label: 'Edge (jackpot)', chance: 1, note: 'Very rare' },
  ],
};

const Meter = ({ value }) => (
  <div className="w-full bg-black/30 rounded-full h-2">
    <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

const PlinkoWinProbabilities = ({ risk = 'Medium' }) => {
  const data = rowsToChances[risk] || rowsToChances.Medium;
  return (
    <Paper elevation={5} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, background: 'linear-gradient(135deg, rgba(9,0,5,0.9) 0%, rgba(25,5,30,0.85) 100%)', border: '1px solid rgba(104,29,219,0.2)' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'white', borderBottom: '1px solid rgba(104,29,219,0.3)', pb: 1.5 }}>
        Win Probabilities
      </Typography>
      <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FaInfoCircle /> Visual guide to chances in Plinko (illustrative).
      </Typography>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.map((item) => (
          <div key={item.label} className="bg-black/20 rounded-xl p-3 border border-white/10">
            <div className="text-sm text-white/60">{item.label}</div>
            <div className="my-2"><Meter value={item.chance} /></div>
            <div className="text-white font-display">{item.chance}%</div>
            <div className="text-xs text-amber-300/80">{item.note}</div>
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default PlinkoWinProbabilities;


