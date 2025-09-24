"use client";

import { Box } from '@mui/material';

const WheelVideo = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: { xs: '56.25%', md: '56.25%' },
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        border: '2px solid rgba(216, 38, 51, 0.4)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
          border: '2px solid rgba(216, 38, 51, 0.5)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          right: '-3px',
          bottom: '-3px',
          borderRadius: '20px',
          background: 'linear-gradient(45deg, #d82633, #681DDB, #14D854, #d82633)',
          backgroundSize: '400% 400%',
          zIndex: -1,
          filter: 'blur(10px)',
          opacity: 0.7,
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          py: 1.5,
          background: 'linear-gradient(to bottom, rgba(9, 0, 5, 0.8), rgba(9, 0, 5, 0))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
        }}
      >
      </Box>
      <Box
        component="iframe"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
          borderRadius: '12px',
          zIndex: 1
        }}
        src="https://www.youtube.com/embed/M3EWcKHuzi8"
        title="Fortune Wheel Gameplay"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  );
};

export default WheelVideo;