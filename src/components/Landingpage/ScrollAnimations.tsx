'use client';

import * as React from 'react';
import { Box } from '@mui/material';

export type UseScrollInViewOptions = {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean; 
};

/**
 * IntersectionObserver hook that can either reset on scroll
 * or freeze after first visibility.
 */
export function useScrollInView(
  { threshold = 0.25, rootMargin = '0px', freezeOnceVisible = false }: UseScrollInViewOptions = {}
) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (freezeOnceVisible && entry.isIntersecting) {
          setInView(true);
          return;
        }
        // Reset whenever it leaves the viewport so animation can replay
        setInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, freezeOnceVisible]);

  return { ref, inView };
}

/* ---------------- Fade in on scroll ---------------- */

export type ScrollFadeInProps = {
  children: React.ReactNode;
  delay?: number;      // ms
  translateY?: number; // px
};

export const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
  children,
  delay = 0,
  translateY = 28,
}) => {
  const { ref, inView } = useScrollInView();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : `translateY(${translateY}px)`,
        transition: `opacity 900ms ${delay}ms ease-out, transform 900ms ${delay}ms ease-out`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Box>
  );
};

export type ScrollRevealPanelProps = {
  children: React.ReactNode;
  delay?: number;
};

export const ScrollRevealPanel: React.FC<ScrollRevealPanelProps> = ({
  children,
  delay = 0,
}) => {
  // Slightly lower threshold so it feels less twitchy
  const { ref, inView } = useScrollInView({ threshold: 0.15 });

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        // Start fully cropped from the bottom, reveal top to bottom
        clipPath: inView
          ? 'inset(0% 0% 0% 0%)'
          : 'inset(0% 0% 100% 0%)',
        transform: inView ? 'scale(1)' : 'scale(0.98)',
        transition: `clip-path 900ms ${delay}ms ease-out, transform 900ms ${delay}ms ease-out`,
        willChange: 'clip-path, transform',
      }}
    >
      {children}
    </Box>
  );
};
