'use client';

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { useScroll, useTransform } from 'framer-motion';
import DarkVeil from '../components/Landingpage/DarkVeil'; 

import {
  HeroSection,
  CarouselSection,
  DescriptionSection,
  VideoConnectSection,
  ImageCollageSection,
  FeaturesSection,
  MatadorStaircaseSection,
  TeamSection,
} from '@/components/Landingpage/MuiSections';
import { CsunSignParallax } from '@/components/Landingpage/MediaAnimations';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -160]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        color: '#ffffff',
        backgroundColor: '#A80532',
        overflowX: 'hidden',
      }}
    >
      {/* ---------------------------------------------- */}
      {/* EMBEDDED AnimatedBackground (was BG_animated.tsx) */}
      {/* ---------------------------------------------- */}
      <div className="darkveil-wrapper">
        <DarkVeil />
      </div>

      <style jsx>{`
        .darkveil-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
      `}</style>
      {/* ---------------------------------------------- */}

      {/* MAIN CONTENT */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <HeroSection
          heroY={heroY}
          heroScale={heroScale}
          heroOpacity={heroOpacity}
        />

        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 6, md: 8 },
            mb: { xs: 6, md: 10 },
            pb: { xs: 4, md: 6 },
          }}
        >
          <CarouselSection />
          <DescriptionSection />
          <VideoConnectSection />
          <ImageCollageSection />
          <CsunSignParallax />
          <FeaturesSection />
          <MatadorStaircaseSection /> 
          <TeamSection />
        </Container>
      </Box>
    </Box>
  );
}
