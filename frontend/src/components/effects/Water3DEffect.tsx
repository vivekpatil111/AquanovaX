import React from 'react';
import { Box, Typography } from '@mui/material';
import { Droplets } from 'lucide-react';

export const Water3DEffect = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '32px',
        p: { xs: 4, md: 6 },
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        mb: 4,
      }}
      className="group"
    >
      {/* Background Glow */}
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%',
        background: 'radial-gradient(circle at center, rgba(14,165,233,0.3) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none'
      }} />

      {/* 3D Animated Organic Liquid Blobs */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-60%',
          left: '-10%',
          width: '120%',
          height: '150%',
          opacity: 0.4,
          background: 'linear-gradient(180deg, rgba(2, 132, 199, 0.8) 0%, rgba(14, 165, 233, 0.2) 100%)',
          borderRadius: '43% 57% 53% 47% / 51% 42% 58% 49%',
          animation: 'liquidSpin 18s infinite linear',
          transform: 'rotateX(50deg) translateZ(-80px)',
          filter: 'blur(8px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-50%',
          left: '-20%',
          width: '140%',
          height: '140%',
          opacity: 0.6,
          background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.9) 0%, rgba(2, 132, 199, 0.4) 100%)',
          borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
          animation: 'liquidSpin 22s infinite linear reverse',
          transform: 'rotateX(55deg) translateZ(-30px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-45%',
          left: '-15%',
          width: '130%',
          height: '130%',
          opacity: 0.85,
          background: 'linear-gradient(180deg, rgba(125, 211, 252, 1) 0%, rgba(14, 165, 233, 0.6) 100%)',
          borderRadius: '48% 52% 43% 57% / 51% 54% 46% 49%',
          animation: 'liquidSpin 15s infinite linear',
          transform: 'rotateX(60deg) translateZ(40px)',
          boxShadow: 'inset 0 10px 30px rgba(255,255,255,0.6), 0 -10px 40px rgba(56,189,248,0.4)',
        }}
      />

      {/* Surface Highlights */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '0',
          width: '200%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          transform: 'rotateX(60deg) translateZ(45px)',
          animation: 'shimmer 4s infinite linear',
        }}
      />

      {/* Floating Glass Bubbles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: `${10 + i * 11}%`,
            width: `${12 + (i % 4) * 8}px`,
            height: `${12 + (i % 4) * 8}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)',
            animation: `floatUp ${5 + (i % 3) * 2}s infinite cubic-bezier(0.4, 0, 0.2, 1)`,
            animationDelay: `${i * 0.7}s`,
            transform: `translateZ(${30 + (i % 3) * 20}px)`,
          }}
        />
      ))}

      {/* Foreground Frosted Glass Content */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 10, 
          transform: 'translateZ(120px)', 
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          '.group-hover &': { transform: 'translateZ(150px) translateY(-5px)' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box 
          sx={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            maxWidth: '650px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '12px', 
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2,132,199,0.4)'
            }}>
              <Droplets size={24} color="white" />
            </Box>
            <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: 1.5 }}>
              AquanovaX Dashboard
            </Typography>
          </Box>
          <Typography variant="h3" fontWeight="800" sx={{ color: 'white', mb: 1, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            {subtitle}
          </Typography>
        </Box>

        {/* Decorative Badge */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.2)',
          animation: 'pulseGlow 4s infinite alternate',
        }}>
          <Typography variant="h4" fontWeight="900" sx={{ color: '#bae6fd' }}>100%</Typography>
          <Typography variant="caption" sx={{ color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>Optimal</Typography>
        </Box>
      </Box>

      {/* Animations */}
      <style>
        {`
          @keyframes liquidSpin {
            0% { transform: rotateX(60deg) rotateZ(0deg) scale(1); }
            50% { transform: rotateX(60deg) rotateZ(180deg) scale(1.05); }
            100% { transform: rotateX(60deg) rotateZ(360deg) scale(1); }
          }
          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.8) translateZ(20px); opacity: 0; }
            20% { opacity: 1; transform: translateY(-20px) scale(1) translateZ(40px); }
            80% { opacity: 0.8; }
            100% { transform: translateY(-150px) scale(1.2) translateZ(80px); opacity: 0; }
          }
          @keyframes shimmer {
            0% { transform: rotateX(60deg) translateZ(45px) translateX(-50%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: rotateX(60deg) translateZ(45px) translateX(50%); opacity: 0; }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.2); }
            100% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.4), inset 0 0 30px rgba(56, 189, 248, 0.4); }
          }
        `}
      </style>
    </Box>
  );
};
