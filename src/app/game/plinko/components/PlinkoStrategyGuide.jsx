"use client";
import React, { useState } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Avatar, Chip, Fade } from '@mui/material';
import { FaLightbulb, FaChevronDown, FaStar, FaExclamationTriangle, FaCalculator, FaBookOpen, FaCheck, FaTimes } from 'react-icons/fa';

const PlinkoStrategyGuide = () => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);

  const strategies = [
    {
      id: 's1',
      title: 'Low-Risk Grinding',
      difficulty: 'Beginner',
      effectiveness: 4,
      risk: 'Low',
      color: '#14D854',
      description: 'Use Low risk with 14–16 rows and small bet amounts to target center multipliers frequently. Aim for long sessions with low variance.',
      pros: ['Low variance', 'Beginner friendly', 'Sustainable sessions'],
      cons: ['Lower peak payouts', 'Slow growth'],
      example: 'Set risk to Low, rows to 16, bet 0.1–0.25 APT, play many rounds and cash out on streaks.'
    },
    {
      id: 's2',
      title: 'Medium-Risk Balance',
      difficulty: 'Intermediate',
      effectiveness: 3,
      risk: 'Medium',
      color: '#FFA500',
      description: 'Balanced approach: Medium risk and 12–15 rows to mix frequent small wins with occasional larger multipliers.',
      pros: ['Balanced returns', 'Exciting gameplay'],
      cons: ['Still volatile on downswings'],
      example: 'Risk Medium, rows 15, bet 0.25–0.5 APT. Stop-loss and take-profit rules keep variance under control.'
    },
    {
      id: 's3',
      title: 'High-Risk Hunting',
      difficulty: 'Advanced',
      effectiveness: 2,
      risk: 'High',
      color: '#d82633',
      description: 'High risk with fewer rows increases edge-slot payouts. Bankroll management is critical as variance is high.',
      pros: ['Huge top-end payouts', 'Adrenaline gameplay'],
      cons: ['High variance', 'Can deplete bankroll quickly'],
      example: 'Risk High, rows 12–14, small fixed bet (e.g., 0.1 APT) and strict stop-loss.'
    }
  ];

  return (
    <Paper elevation={5} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, background: 'linear-gradient(135deg, rgba(9,0,5,0.9) 0%, rgba(25,5,30,0.85) 100%)', backdropFilter: 'blur(15px)', border: '1px solid rgba(104,29,219,0.2)', position: 'relative', overflow: 'hidden' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid rgba(104,29,219,0.3)', pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, color: 'white' }}>
        <FaBookOpen color="#FFA500" size={22} />
        <span style={{ background: 'linear-gradient(90deg,#FFFFFF,#FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Plinko Strategy Guide</span>
      </Typography>

      <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 3 }}>
        Popular Plinko betting approaches. These strategies can shape variance, but cannot overcome the house edge.
      </Typography>

      {strategies.map((s, idx) => (
        <Fade in key={s.id} style={{ transformOrigin: '0 0 0', transitionDelay: `${idx * 100}ms` }}>
          <Accordion expanded={expanded === s.id} onChange={handleChange(s.id)} sx={{ backgroundColor: 'transparent', boxShadow: 'none', mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<FaChevronDown color="white" /> }>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar sx={{ bgcolor: s.color, width: 40, height: 40, boxShadow: `0 0 10px ${s.color}80` }}>
                  <FaLightbulb />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" color="white" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{s.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={s.difficulty} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.3)', color: 'white', height: 24 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">Effectiveness:</Typography>
                      {[...Array(5)].map((_, i) => (<FaStar key={i} size={12} color={i < s.effectiveness ? '#FFA500' : 'rgba(255,255,255,0.2)'} />))}
                    </Box>
                    <Chip label={`Risk: ${s.risk}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'white', height: 24 }} />
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph color="rgba(255,255,255,0.9)" sx={{ mb: 2 }}>{s.description}</Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1, p: 2, borderRadius: 2, backgroundColor: 'rgba(20,216,84,0.1)', border: '1px solid rgba(20,216,84,0.2)' }}>
                  <Typography variant="subtitle2" color="#14D854" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><FaCheck color="#14D854" />Advantages</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {s.pros.map((p, i) => (<Typography component="li" key={i} variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 0.5 }}>{p}</Typography>))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1, p: 2, borderRadius: 2, backgroundColor: 'rgba(216,38,51,0.1)', border: '1px solid rgba(216,38,51,0.2)' }}>
                  <Typography variant="subtitle2" color="#d82633" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><FaTimes color="#d82633" />Disadvantages</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {s.cons.map((c, i) => (<Typography component="li" key={i} variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 0.5 }}>{c}</Typography>))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.2)', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <FaCalculator color="#FFA500" style={{ marginTop: 3 }} />
                <Box>
                  <Typography variant="subtitle2" color="#FFA500" sx={{ mb: 1 }}>Example:</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">{s.example}</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Fade>
      ))}

      <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: 'linear-gradient(135deg, rgba(216,38,51,0.05) 0%, rgba(216,38,51,0.15) 100%)', border: '1px solid rgba(216,38,51,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <FaExclamationTriangle color="#d82633" size={20} />
        <Typography variant="body2" color="rgba(255,255,255,0.8)"><strong>Important:</strong> Strategies shape variance only; house edge remains. Play responsibly.</Typography>
      </Box>
    </Paper>
  );
};

export default PlinkoStrategyGuide;


