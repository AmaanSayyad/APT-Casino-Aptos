"use client";
import React from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";
import { FaCoins, FaExclamationTriangle } from 'react-icons/fa';

// Display multipliers by risk/rows as examples (illustrative; synced with UI labels)
const payoutExamples = [
  { label: 'Low Risk (16 rows)', examples: ['16x', '9x', '2x', '1.4x', '1.1x', '1x', '0.5x'], color: '#14D854' },
  { label: 'Medium Risk (16 rows)', examples: ['110x', '41x', '10x', '3x', '1.5x', '1x', '0.5x', '0.3x'], color: '#FFA500' },
  { label: 'High Risk (16 rows)', examples: ['1000x', '130x', '26x', '9x', '4x', '2x', '0.2x'], color: '#d82633' },
];

const PlinkoPayouts = () => {
  return (
    <Paper elevation={5} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, background: 'linear-gradient(135deg, rgba(9,0,5,0.9) 0%, rgba(25,5,30,0.85) 100%)', border: '1px solid rgba(104,29,219,0.2)', position: 'relative', overflow: 'hidden' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid rgba(104,29,219,0.3)', pb: 1.5, color: 'white', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FaCoins color="#681DDB" size={20} /> Plinko Payouts
      </Typography>
      <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>
        Example multiplier ranges by risk profile. Actual outcome depends on physics and bin landing.
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: '560px' }}>
          <Grid container sx={{ py: 1, px: 2, borderRadius: '8px 8px 0 0', background: 'linear-gradient(90deg, rgba(104,29,219,0.2), rgba(216,38,51,0.2))', mb: 1 }}>
            <Grid xs={4}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">Profile</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">Sample Multipliers</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: 'rgba(104,29,219,0.15)', mb: 1 }} />
          {payoutExamples.map((row, idx) => (
            <React.Fragment key={row.label}>
              <Grid container sx={{ py: 1.5, px: 2, borderRadius: '4px', '&:hover': { backgroundColor: 'rgba(104,29,219,0.1)' } }}>
                <Grid xs={4}>
                  <Typography color="white" sx={{ display: 'flex', alignItems: 'center', '&::before': { content: '""', display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: row.color, marginRight: 1 } }}>{row.label}</Typography>
                </Grid>
                <Grid xs={8}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {row.examples.map((ex) => (
                      <Chip key={ex} label={ex} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: `${row.color}20`, color: 'white', border: `1px solid ${row.color}40` }} />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              {idx !== payoutExamples.length - 1 && <Divider sx={{ borderColor: 'rgba(104,29,219,0.05)' }} />}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 3, p: 2, borderRadius: 2, background: 'linear-gradient(135deg, rgba(216,38,51,0.05) 0%, rgba(216,38,51,0.15) 100%)', border: '1px solid rgba(216,38,51,0.1)' }}>
        <FaExclamationTriangle color="#d82633" size={16} />
        <Typography variant="body2" color="rgba(255,255,255,0.8)">Multipliers vary per rows and risk; samples mirror UI tables.</Typography>
      </Box>
    </Paper>
  );
};

export default PlinkoPayouts;


