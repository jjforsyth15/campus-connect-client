'use client';

import * as React from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { keyframes } from '@mui/system';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, useScroll, useTransform, useAnimation, type Variants } from 'framer-motion';
import { Crimson_Text } from 'next/font/google';

const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['700'], // or ['400','600','700'] if you want more weights

});


/* -----------------------------------------------------------
   1.  GLOBAL CONSTANTS
----------------------------------------------------------- */

export const HERO_VIDEO_SRC =
  'https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Generic%20Webpage%20Final%20New%20Bitrate.mp4';

/* -----------------------------------------------------------
   2.  SCROLL-BASED IN-VIEW HOOK (NO INTERSECTION OBSERVER)
----------------------------------------------------------- */

function useMediaInViewScroll() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCheck = () => {
        const node = ref.current;
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;

        // fully out of viewport → treat as hidden
        const upperGuard = vh * 0.15;  // 15% from top
        const lowerGuard = vh * 0.85;  // 15% from bottom

        const isVisible = rect.bottom > upperGuard && rect.top < lowerGuard;
        setInView(isVisible);
    };

    handleCheck();

    window.addEventListener('scroll', handleCheck, { passive: true });
    window.addEventListener('resize', handleCheck);

    return () => {
      window.removeEventListener('scroll', handleCheck);
      window.removeEventListener('resize', handleCheck);
    };
  }, []);

  return { ref, inView };
}

/* -----------------------------------------------------------
   3.  CENTER → FULL UNRAVEL WRAPPER
----------------------------------------------------------- */

export type MediaRevealFromCenterProps = {
  children: React.ReactNode;
  delay?: number; // ms
};

export const MediaRevealFromCenter: React.FC<MediaRevealFromCenterProps> = ({
  children,
  delay = 0,
}) => {
  const { ref, inView } = useMediaInViewScroll();

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        opacity: inView ? 1 : 0,
        // horizontal collapse from the center
        clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 50% 0% 50%)',
        transition: `
          opacity 450ms ${delay}ms ease-out,
          clip-path 650ms ${delay}ms ease-out
        `,
        willChange: 'opacity, clip-path',
        pointerEvents: inView ? 'auto' : 'none',
      }}
    >
      {children}
    </Box>
  );
};

// vertical cover reveal: collapses from top & bottom
export const MediaVerticalCover: React.FC<MediaRevealFromCenterProps> = ({
  children,
  delay = 0,
}) => {
  const { ref, inView } = useMediaInViewScroll();

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',

        // Video should fade in/out but NEVER shrink horizontally
        opacity: inView ? 1 : 0,

        // Collapse from top & bottom only
        clipPath: inView
          ? 'inset(0% 0% 0% 0%)'    // fully visible
          : 'inset(50% 0% 50% 0%)', // collapse to horizontal line

        transition: `
          opacity 450ms ${delay}ms ease-out,
          clip-path 700ms ${delay}ms ease-out
        `,
        willChange: 'opacity, clip-path',
      }}
    >
      {children}
    </Box>
  );
};

/* -----------------------------------------------------------
   4.  FEATURE CAROUSEL
----------------------------------------------------------- */

export type CarouselCard = {
  title: string;
  text: string;
  image?: string; // optional background image
};

export type AnimatedFeatureCarouselProps = {
  cards: CarouselCard[];
};

const carouselSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

export const AnimatedFeatureCarousel: React.FC<AnimatedFeatureCarouselProps> = ({
  cards,
}) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <MediaRevealFromCenter delay={120}>
      <Box
        sx={{
          mt: 3,
          pb: 4, // space for dots
          '& .slick-dots': {
            bottom: -30,
          },
          '& .slick-dots li button:before': {
            fontSize: '10px',
            opacity: 0.35,
            color: '#ffffff',
          },
          '& .slick-dots li.slick-active button:before': {
            opacity: 0.95,
            color: '#ffffff',
          },
        }}
      >
        <Slider {...carouselSettings}>
          {cards.map((card, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <Box
                key={card.title}
                sx={{
                  px: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {/* OUTER CARD – tall, playing-card style */}
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: '80vw', sm: 320, md: 300 }, // <- card width
                    height: { xs: 360, md: 420 },
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.85)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.3)', // no big glow
                    backgroundColor: 'transparent',
                  }}
                >
                  {/* IMAGE BACKGROUND */}
                  {card.image && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                      }}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 600px) 90vw, 340px"
                        style={{ objectFit: 'cover' }}
                      />
                      {/* dark overlay to improve text contrast */}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          zIndex: 1,
                        }}
                      />
                    </Box>
                  )}

                  {/* CONTENT LAYER */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 2.1,
                      gap: 1.4,
                    }}
                  >
                    {/* TITLE */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        textShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        zIndex: 2,
                        //WebkitTextStroke: '.5px red',
                      }}
                    >
                      {card.title}
                    </Typography>

                    {/* PILL THAT MORPHS INTO INFO PANEL */}
                    <Box
                      component="button"
                      type="button"
                      onClick={() => handleToggle(idx)}
                      sx={{
                        borderRadius: isExpanded ? 3 : 999,
                        border: '2px solid rgba(255,255,255,0.95)',
                        backgroundColor: isExpanded ? '#ffffff' : 'transparent',
                        color: isExpanded ? '#111827' : '#ffffff',
                        cursor: 'pointer',
                        width: '100%',
                        px: 2,
                        py: isExpanded ? 1.6 : 0.8,
                        textAlign: 'left',
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        overflow: 'hidden',
                        maxHeight: isExpanded ? 190 : 48,
                        zIndex: 2,
                        transition:
                          'border-radius 320ms cubic-bezier(0.22,0.61,0.36,1), ' +
                          'padding 320ms cubic-bezier(0.22,0.61,0.36,1), ' +
                          'background-color 320ms cubic-bezier(0.22,0.61,0.36,1), ' +
                          'max-height 320ms cubic-bezier(0.22,0.61,0.36,1), ' +
                          'color 220ms ease-out',
                        '&:hover': {
                          backgroundColor: isExpanded
                            ? '#ffffff'
                            : 'rgba(255,255,255,0.08)',
                        },
                      }}
                    >
                      {/* "More info" label INSIDE button */}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          opacity: 0.95,
                        }}
                      >
                        More info
                      </Typography>

                      {/* DESCRIPTION – expands under the label */}
                      <Typography
                        component="span"
                        sx={{
                          mt: isExpanded ? 0.6 : 0,
                          fontSize: '0.85rem',
                          lineHeight: 1.6,
                          opacity: isExpanded ? 1 : 0,
                          maxHeight: isExpanded ? 120 : 0,
                          overflow: 'hidden',
                          transform: `translateY(${isExpanded ? 0 : 4}px)`,
                          transition:
                            'opacity 260ms cubic-bezier(0.22,0.61,0.36,1), ' +
                            'transform 260ms cubic-bezier(0.22,0.61,0.36,1), ' +
                            'margin-top 260ms cubic-bezier(0.22,0.61,0.36,1), ' +
                            'max-height 320ms cubic-bezier(0.22,0.61,0.36,1)',
                        }}
                      >
                        {card.text}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Slider>
      </Box>
    </MediaRevealFromCenter>
  );
};

/* -----------------------------------------------------------
   5.  HERO VIDEO SECTION
----------------------------------------------------------- */

export const ToroHeroVideo: React.FC = () => {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // strong parallax on video
  const videoY = useTransform(scrollYProgress, [0, 1], ['15%', '-65%']);

  // title parallax + fade
  const titleY = useTransform(scrollYProgress, [0, 1], ['15%', '-65%']);
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.8, 1],
    [0, 1, 1, 0],
  );

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',

        // full-bleed across browser
        width: '100vw',
        ml: 'calc(50% - 50vw)',

        minHeight: { xs: '70vh', md: '100vh' },
        overflow: 'hidden',
        background: 'transparent',
        color: '#ffffff',
      }}
    >
      {/* PARALLAX VIDEO – full width background */}
      <Box
        component={motion.div}
        style={{ y: videoY }}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          component="video"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* STICKY TITLE – overlayed on top of the video */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            component={motion.div}
            style={{ y: titleY, opacity: titleOpacity }}
            sx={{
              px: { xs: 2.5, md: 8 },
              textAlign: 'center',
            }}
          >
            {/* three-line title layout */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {/* TOP – GET CONNECTED */}
              <Typography
                component="div"
                className={crimson.className}
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                  fontFamily: crimson.style.fontFamily,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                GET CONNECTED
              </Typography>

              {/* MIDDLE – decorative "with" + lines */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {/* left line */}
                <Box
                  sx={{
                    flex: '1 1 auto',
                    height: '1px',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    maxWidth: '120px',
                  }}
                />

                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    fontFamily: crimson.style.fontFamily,
                    fontWeight: 400,
                    fontStyle: 'italic',
                    whiteSpace: 'nowrap',
                  }}
                >
                  with
                </Typography>

                {/* right line */}
                <Box
                  sx={{
                    flex: '1 1 auto',
                    height: '1px',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    maxWidth: '120px',
                  }}
                />
              </Box>

              {/* BOTTOM – TORO */}
              <Typography
                component="div"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                  fontFamily: crimson.style.fontFamily,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                TORO
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};


/* -----------------------------------------------------------
   6.  VERTICAL STRIP GRID
----------------------------------------------------------- */

const scrollDown = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

const scrollUp = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(0); }
`;

type VerticalStripProps = {
  images: string[];
  direction: 'up' | 'down';
};

const VerticalImageStrip: React.FC<VerticalStripProps> = ({
  images,
  direction,
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      height: { xs: 650, md: 900 },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '85%',
        borderRadius: 1,
        border: '2px solid rgba(255,255,255,0.9)',
        backgroundColor: 'rgba(0,0,0,0.55)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 1,
          p: 1,
          animation: `${direction === 'up' ? scrollUp : scrollDown} 40s linear infinite`,
        }}
      >
        {images.map((src, idx) => (
          <Box
            key={`${src}-${idx}`}
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',   // exact square
              flex: '0 0 auto',       // 🔑 do NOT shrink; keep natural height
              borderRadius: 0.75,
              overflow: 'hidden',
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="260px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export type AnimatedImageStripGridProps = {
  columns: string[][]; // array of image arrays, one per column
};

export const AnimatedImageStripGrid: React.FC<AnimatedImageStripGridProps> = ({
  columns,
}) => {
  return (
    <MediaRevealFromCenter delay={120}>
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {columns.map((colImages, idx) => {
          // create seamless infinite loop for each column
          const loopImages = React.useMemo(
            () => colImages.concat(colImages).concat(colImages),
            [colImages]
          );

          return (
            <VerticalImageStrip
              key={idx}
              images={loopImages}
              direction={idx % 2 === 0 ? 'down' : 'up'} // alternate directions
            />
          );
        })}
      </Box>
    </MediaRevealFromCenter>
  );
};

/* -----------------------------------------------------------
   MATADOR STAIRCASE PARALLAX (IMAGE + TEXT EXPANSION)
----------------------------------------------------------- */

export const MatadorStaircaseParallax: React.FC = () => {
  const { ref: sectionRef, inView } = useMediaInViewScroll();

  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start({
        x: '15%',
        y: '-10%',
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 80,
          damping: 18,
          mass: 0.9,
        },
      });
    } else {
      // reset animation
      controls.start({
        x: '120%',
        y: '-10%',
        opacity: 0,
        transition: { duration: 0.3 },
      });
    }
  }, [inView, controls]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        width: '100vw',
        ml: 'calc(50% - 50vw)',
        py: { xs: 6, md: 10 },
        overflow: 'hidden',
      }}
    >
      {/* TEXT – anchored to image left edge, slides out when section is in view */}
      <Box
        component={motion.div}
        initial={{ x: '120%', opacity: 0 }}
        animate={controls}
        sx={{
          position: 'absolute',
          top: '46%',
          transform: 'translateY(-50%)',
          right: { xs: '70vw', md: '55vw' },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.4,
          width: { xs: '70vw', md: '40vw' },
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {['Built', 'by Matadors', 'for Matadors'].map((line, idx) => (
          <Box
            key={line}
            className={crimson.className}
            sx={{
              fontFamily: crimson.style.fontFamily,
              fontSize: { xs: '2.6rem', md: '3.6rem' },
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textShadow: '0 4px 12px rgba(0,0,0,0.85)',
              ml: `${idx * 40}px`,
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </Box>
        ))}
      </Box>
      {/* IMAGE */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '70vw', md: '55vw' },
          aspectRatio: '16 / 9',
          ml: 'auto',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <Image
          src="/images/Homepage/MatadorSunset.png"
          alt="Matador Statue Sunset"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
};

/* -----------------------------------------------------------
   CSUN SIGN PARALLAX (INVERTED VERSION)
----------------------------------------------------------- */

export const CsunSignParallax: React.FC = () => {
  const { ref: sectionRef, inView } = useMediaInViewScroll();
  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start({
        x: '-15%',
        y: '-10%',
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 80,
          damping: 18,
          mass: 0.9,
        },
      });
    } else {
      // reset animation (from left side now)
      controls.start({
        x: '-120%',
        y: '-10%',
        opacity: 0,
        transition: { duration: 0.3 },
      });
    }
  }, [inView, controls]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        width: '100vw',
        ml: 'calc(50% - 50vw)',
        py: { xs: 6, md: 10 },
        overflow: 'hidden',
      }}
    >
      {/* TEXT – anchored to image right edge, slides in from left */}
      <Box
        component={motion.div}
        initial={{ x: '-120%', opacity: 0 }}
        animate={controls}
        sx={{
          position: 'absolute',
          top: '46%',
          transform: 'translateY(-50%)',
          left: { xs: '70vw', md: '62vw' },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.4,
          width: { xs: '70vw', md: '40vw' },
          pointerEvents: 'none',
          zIndex: 1,
          textAlign: 'right',
        }}
      >
        {[
          'Classmates to lifelong friends',
          'Connect. Collaborate. Conquer',
          'Your campus. Your people. Your success.',
        ].map((line, idx) => (
          <Box
            key={line}
            className={crimson.className}
            sx={{
              fontFamily: crimson.style.fontFamily,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textShadow: '0 4px 12px rgba(0,0,0,0.85)',
              mr: `${idx * 40}px`,
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </Box>
        ))}
      </Box>

      {/* IMAGE – now on the LEFT side */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '70vw', md: '55vw' },
          aspectRatio: '16 / 9',
          mr: 'auto',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <Image
          src="/images/Homepage/CSUN_Sign.jpg" // put your file here in the same directory
          alt="CSUN campus sign with students"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
};
